import express from 'express'
import Joi from "joi"
import mongoose from 'mongoose'
import * as modelHelper from '../helpers/modelHelper.js'
import getResponse from '../helpers/responseHelper.js'

/**
 * Router class
 */
export default class Router {
    #router = express.Router()

    /**
     * Initialize a new Router instance
     *
     * @param {Object} resources resources object
     */
    constructor(resources) {
        this.resources = resources

        Object.keys(this.resources).forEach(key => {
            this.resources[key].model = mongoose.model(key, new mongoose.Schema(this.resources[key].schema))
        })
    }

    /**
     * Create different HTTP endpoints based on provided resource objects
     *
     * @return {Object} returns router object
     */
    getRoutes() {
        // Create
        this.#getRoute('/', 'post')

        // Read
        this.#getRoute('/', 'get')
        this.#getRoute('/:id', 'get')

        // Update
        this.#getRoute('/:id', 'patch')

        // Delete
        this.#getRoute('/:id', 'delete')

        return this.#router
    }

    // Return routing logic based on router param and HTTP request type
    #getRoute(param, type) {
        return this.#router[type](param, async (req, res) => {
            // URL endpoint
            const endpoint = this.#getEndpoint(req)

            // Log the request
            console.log(`${type} /${endpoint.toLowerCase()}${(req.params.id) ? '/' + req.params.id : ''}`)
            
            // resource Object
            const resourceObj = this.#getresource(endpoint)

            if (!resourceObj.schema) {
                return getResponse(404, res)
            }

            // Validation rules
            const resourceValidationRules = resourceObj.validationRules[type]
            const localValidationRules = (param && param == '/:id') ? {
                id: Joi.string().trim().required()
            } : {}

            // Merge both validation rules
            const validationRules = this.#mergeObjects(resourceValidationRules, localValidationRules)

            // combine the req.body and req.params payloads into one
            const payload = this.#mergeObjects(req.body, req.params)

            // Validate the payload based on the resource validation rules
            const joiSchema = Joi.object(validationRules).validate(payload)
        
            const { error, value } = joiSchema

            if (error) {
                return res.status(400).send({ status: 400, message: error.details[0].message })
            } else {
                const queryResult = await this.#queryDB(type, req, resourceObj.model, {
                    id: (value.id) ? value.id : undefined,
                    type: (param == '/:id') ? 'one' : 'all',
                    data: value
                })

                // Return HTTP response based on database query result
                if (Array.isArray(queryResult) || typeof queryResult === 'object') {
                    return getResponse(200, res, queryResult)
                } else {
                    // pass queryResult directly to getResponse 
                    // since queryResult is probably a statusCode at this point
                    return getResponse(queryResult, res)
                }
            }
        })
    }

    // Interact with model based on HTTP request type
    async #queryDB(requestType, req, model, options) {
        const endpoint = this.#getEndpoint(req)

        switch (requestType) {
            case 'get':
                return await modelHelper.find(model, options)       
                break;
        
            case 'post':
                return await modelHelper.create(model, options)       
                break;

            case 'patch':
                return await modelHelper.update(model, options)       
                break;

            case 'delete':
                return await modelHelper.remove(model, options)       
                break;
        
            default:
                break;
        }
    }

    // Determine model to use 
    #getresource(endpoint) {
        const resource = this.resources[endpoint]

        if (resource) {
            return resource
        } else {
            return false
        }
    }

    // Get endpoint from req object
    #getEndpoint(req) {
        const urlString = req.baseUrl
        const urlPaths = urlString.split('/')
        
        return urlPaths[3].toLowerCase()
    }

    // Merge two objects into one and return the new object
    // Todo: refactor
    #mergeObjects(objectOne, objectTwo) {
        const object1 = (objectOne) ? objectOne : {}
        const object2 = (objectTwo) ? objectTwo : {}
        
        const newObject = {}

        Object.keys(object1).forEach((key) => {
            newObject[key] = object1[key]
        })

        Object.keys(object2).forEach((key) => {
            newObject[key] = object2[key]
        })

        return newObject
    }
}