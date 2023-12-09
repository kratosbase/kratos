import express from 'express'
import Joi from "joi"
import * as modelHelper from '../helpers/modelHelper.js'

/**
 * Router class
 */
export default class Router {
    /**
     * Initialize a new Router instance
     *
     * @param {Object} models Object containing models
     */
    constructor(models) {
        this.router = express.Router()
        this.models = models
    }

    /**
     * Create different HTTP endpoints for the provided models
     *
     * @return {Object} returns router object
     */
    getRoutes() {
        this.#getRoute('/', 'get')

        this.#getRoute('/:id', 'get')

        return this.router
    }

    // Return routing logic based on endpoint and HTTP request type
    #getRoute(endpoint, type) {
        return this.router[type](endpoint, async (req, res) => {
            // Get validation rules
            const modelObj = this.#getModel(req)
            const validationRules = modelObj.validationRules

            console.log(modelObj.model)

            if (!modelObj.model) {
                throw new Error('A model was not specified in the model object of the resource you are trying to consume.')
            }

            // Determine HTTP response based on model return value
            const response = async (modelResponse) => {
                //console.log(modelResponse)
                if (typeof modelResponse === 'object' || modelResponse === true) {
                    return await this.#getResponse(200, res, modelResponse)
                } else if (modelResponse === false) {
                    return await this.#getResponse(404, res)
                } else {
                    return await this.#getResponse(500, res)
                }
            }

            // Check if resource validation rules exist
            if (validationRules) {
                // combine the req.body and req.params payloads into one
                const payload = {}

                Object.keys(req.body).forEach((key) => {
                    payload[key] = req.body[key]
                })

                Object.keys(req.params).forEach((key) => {
                    payload[key] = req.params[key]
                })

                // Validate the payload based on the resource validation rules
                const schema = Joi.object(validationRules).validate(payload)
            
                const { error, value } = schema

                if (error) {
                    return res.status(400).send({ status: 400, message: error.details[0].message })
                } else {
                    // Return HTTP response based on database query result
                    return response(await this.#queryDB(type, req, modelObj.model, {
                        data: value
                    }))
                }
            } else {
                // Query db without payload
                return response(await this.#queryDB(type, req, modelObj.model))
            }
        })
    }

    // Interact with model based on HTTP request type
    async #queryDB(requestType, req, model, options) {
        switch (requestType) {
            case 'get':
                const newOptions = options
    
                if (req.params.id) {
                    newOptions.type = 'one'
                    newOptions.id = options.data.id

                    return await modelHelper.get(model, newOptions)
                } else {
                    return await modelHelper.get(model, {type: 'all'})
                }
                break;

            case 'POST':
                break;
                
            default:
                break;
        }
    }

    // Return HTTP response object based on HTTP status code
    #getResponse(status, res, modelResponse) {
        switch (status) {
            case 400:
                return res.status(status).json({
                    status,
                    message: 'bad request'
                })
                break
    
            case 401:
                return res.status(status).json({
                    status,
                    message: 'unauthorized'
                })
                break
        
            case 404:
                return res.status(status).json({
                    status,
                    message: 'resource not found'
                })
                break
    
            case 500:
                return res.status(status).json({
                    status,
                    message: 'internal server error'
                })
                break
    
            case 200:
                if (Array.isArray(modelResponse) || typeof modelResponse === 'object') {
                    return res.status(status).json({
                        status,
                        message: 'ok',
                        data: modelResponse
                    })
                } else {
                    return res.status(status).json({
                        status,
                        message: 'ok'
                    })
                }
                break
            case 'duplicate':
                return res.status(400).json({
                    status: 400,
                    message: 'duplicate data provided'
                })
                break
            default:
                break;
        }
    }

    // Determine model to use 
    #getModel(req) {
        const endpoint = (() => {
            const urlString = req.baseUrl
            const urlPaths = urlString.split('/')
            return urlPaths[3].charAt(0).toUpperCase() + urlPaths[3].slice(1)
        })()

        const model = this.models[endpoint]

        if (model) {
            return model
        } else {
            throw new Error(`${endpoint} model seems to exist but was not added to the Router class.`)
        }
    }
}