import mongoose from "mongoose"

/**
 * Model class
 */
export default class Model {
    constructor(name, resource) {
        /**
         * Initialize new Model instance (mongoose wrapper)
         *
         * @param {String} name Model name
         */
        this.resource = resource
        this.model = mongoose.model(name, new mongoose.Schema(this.resource.schema))
    }
}