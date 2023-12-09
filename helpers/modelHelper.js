import mongoose from "mongoose"

export async function get(model, options) {
    const validID = mongoose.Types.ObjectId.isValid(options.id)

    if (options.type == 'one' && validID) {
        return await model.findOne({ _id: options.id.toObjectId() })
            .then((response) => {
                if (response) {
                    return response
                } else {
                    return false
                }
            })
            .catch((e) => {
                console.log(e)

                return 'error'
            })
    } else if (options.type == 'all') {
        return await model.find()
            .then((response) => {
                if (response) {
                    return response
                } else {
                    return false
                }
            })
            .catch((e) => {
                console.log(e)

                return 'error'
            })
    } else {
        return false
    }
}

export async function create(data, model) {
    const dataExists = await exists(data, model)

    if (!dataExists) {
        return await model.create(data)
            .then((response) => {
                if (response) {
                    return true
                } else {
                    return false
                }
            })
            .catch(e => { 
                console.log(e); 
                return 'error'
            })
    } else {
        return 'duplicate'
    }
}

export async function update(id, data, model) {
    const validID = mongoose.Types.ObjectId.isValid(id)

    if (!validID) {
        return false
    }

    const dataExists = await exists(data, model)

    if (dataExists) {
        return 'error_exists'
    }

    return await model.updateOne({_id: id.toObjectId()}, data)
    .then(response => {
        if (response.modifiedCount == 1) {
            return true
        } else {
            return 'error_update'
        }
    })
    .catch(e => {
        //console.log(e)
        return 'error'
    })
}

export async function remove(id, model) {
    const validID = mongoose.Types.ObjectId.isValid(id)

    if (!validID) {
        return false
    }
    
    return await model.findByIdAndDelete(id)
    .then((response) => {
        if (response) {
            return true
        } else {
            return false
        }
    })
    .catch((e) => {
        //console.log(e)

        return 'error'
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