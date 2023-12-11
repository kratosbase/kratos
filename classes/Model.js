import mongoose from "mongoose"

/**
 * Model class
 */
export default class Model {
    constructor(name, schemaObj, req) {
        /**
         * Initialize new Model instance
         *
         * @param {String} name Model name
         * @param {Object} schema Schema object
         * @param {Request} req Resource request
         */
        this.schemaObj = schemaObj
        this.reqType = req.method.toLowerCase()
        this.validationRules = this.schemaObj.validationRules[this.reqType]
        this.model = mongoose.model(name, new mongoose.Schema(this.schemaObj.schema))
    }
}