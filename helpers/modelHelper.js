import mongoose from "mongoose"

export async function find(model, options) {
    const validID = mongoose.Types.ObjectId.isValid(options.id)

    if (options.type == 'one' && validID) {
        return await model.findOne({ _id: options.id.toObjectId() })
            .then((response) => {
                if (response) {
                    return response
                } else {
                    return 404
                }
            })
            .catch((e) => {
                console.log(e)

                return 500
            })
    } else if (options.type == 'one' && !validID) {
        return await model.findOne(options.data)
            .then((response) => {
                if (response) {
                    return response
                } else {
                    return 404
                }
            })
            .catch((e) => {
                console.log(e)

                return 500
            })
    } else if (options.type == 'all') {
        if (options.data) {
            return await model.find(options.data)
                .then((response) => {
                    if (response) {
                        return response
                    } else {
                        return 404
                    }
                })
                .catch((e) => {
                    //console.log(e)

                    return 500
                })
        } else {
            return await model.find()
                .then((response) => {
                    if (response) {
                        return response
                    } else {
                        return 404
                    }
                })
                .catch((e) => {
                    console.log(e)

                    return 500
                })
        }
    } else if (options.type == 'count') {
        if (options.data) {
            return await model.where(options.data).countDocuments()
                .then((response) => {
                    return { 'count': response }
                })
                .catch((e) => {
                    // console.log(e)

                    return 500
                })
        } else {
            return await model.countDocuments()
                .then((response) => {
                    if (response) {
                        return { 'count': response }
                    } else {
                        return { 'count': 0 }
                    }
                })
                .catch((e) => {
                    // console.log(e)

                    return 500
                })
        }
    } else {
        return false
    }
}

export async function create(model, options) {
    const dataExists = await exists(options.data, model)

    if (!dataExists) {
        return await model.create(options.data)
            .then((response) => {
                if (response) {
                    return response
                } else {
                    return 400
                }
            })
            .catch(e => { 
                if ( e && e.code === 11000 ) {
                    const duplicate_key = Object.keys(e.keyValue)[0]

                    return { status: 400, message: `${duplicate_key} already exists, try again with a unique value.` }
                } else {
                    console.log(e) 
                
                    return 500
                }
            })
    } else {
        return 'duplicate'
    }
}

export async function update(model, options) {
    const validID = mongoose.Types.ObjectId.isValid(options.id)

    if (!validID) {
        return false
    }

    const dataExists = await exists(options.data, model)

    if (dataExists) {
        return 'duplicate'
    }

    return await model.updateOne({_id: options.id.toObjectId()}, options.data)
    .then(response => {
        if (response.modifiedCount == 1) {
            return 200
        } else {
            return 404
        }
    })
    .catch(e => {
        console.log(e)
        return 500
    })
}

export async function remove(model, options) {
    const validID = mongoose.Types.ObjectId.isValid(options.id)

    if (!validID) {
        return false
    }
    
    return await model.findByIdAndDelete(options.id)
    .then((response) => {
        if (response) {
            return 200
        } else {
            return 404
        }
    })
    .catch((e) => {
        //console.log(e)

        return 500
    })
}

export async function removeByParams(params, model) {
    return model.findOneAndDelete(params, function (err) { 
        if (err) { 
            // console.log(err)

            return false
        } else { 
            return true
        } 
    })
}

export async function exists(params, model) {
    return await model.exists(params)
        .then(result => { 
            if (result) {
                return true
            } else {
                return false
            }
        })
}

String.prototype.toObjectId = function() {
    const ObjectId = (mongoose.Types.ObjectId)
    return new ObjectId(this.toString())
}