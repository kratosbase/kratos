import express from 'express'
import Router from './Router.js'
import Model from './Model.js'
import getResponse from '../helpers/responseHelper.js'
import mongoose from "mongoose"
import cors from 'cors'
import helmet from 'helmet'
import index from '../routes/index.js'
import token from '../routes/token.js'
import auth from './../middlewares/auth.js'
import packageJson from './../package.json' assert { type: "json" }
import crypto from 'crypto'

/**
 * Kratos class
 */
export default class Kratos {
    #app = express()
    #consoleColor = '\x1b[36m%s\x1b[0m'

    #localConfig = {
        port: this.#generatePort(),
        api_version: 1,
        version: packageJson.version
    }

    constructor(config) {
        /**
         * Initialize a new Kratos instance.
         * 
         * @param config The default config for Kratos initialization
         */
        this.config = config
        this.port = parseInt(this.config.port)
        this.api_version = (this.config.version) ? this.#getMajorVersion(this.config.version) : this.#localConfig.api_version
        this.baseURL = `/api/v${this.api_version}`
        this.db_server = this.config.db_server
        this.disable_auth = (this.config.disable_auth) ? this.config.disable_auth : false
        this.version = 'Kratos version: ' + this.#localConfig.version
        this.maintenance = (this.config.maintenance) ? this.config.maintenance : false
        this.cors_origins = (this.config.cors_origins) ? this.config.cors_origins : []
        this.show_token = (this.config.show_token) ? this.config.show_token : false
        this.jwt_secret = (this.config.jwt_secret) ? this.config.jwt_secret : crypto.randomBytes(32).toString('hex')
    }

    /**
     * Serve the Kratos application
     *
     * @param {Object} defaultRouter Default router object
     * @param {Object} customRouter Custom router object (optional)
     */
    launch(defaultRouter, customRouter) {
        // Initialize middlewares
        this.#initMiddlewares(this.#app)

        // Initialize config
        this.#initConfig(this.#app)

        // Initialize routers
        this.#initRoutes(this.#app, defaultRouter, customRouter)

        // Initialize DB
        this.#initDB(this.#app)
        .then(() => {
            this.#app.listen(this.port, () => console.log(`Kratos app is running on port: ${this.port}`))
        })
    }

    /**
     * Return JSON HTTP Response
     *
     * @param {Number} statusCode Status code
     * @param {Response} res Resource response object
     * @param {Object} data Data object to respond with in case of successful response
     */
    respond(statusCode, res, data) {
        return getResponse(statusCode, res, data)
    }

    /**
     * Initialize new Router
     *
     * @param {Object} resources resources object
     */
    router(resources) {
        return new Router(resources)
    }

    /**
     * Initialize new Model
     *
     * @param {String} name Model name
     * @param {Object} resource Resource object
     * @param {Request} req Resource request
     */
    model(name, resource, req) {
        return new Model(name, resource, req)
    }

    /**
     * Wrapper for express.Router()
     *
     * @param {Object} options Router options
     */
    expressRouter(options) {
        return express.Router(options)
    }

    /**
     * Return current endpoint from request (refactoring soon)
     * 
     * @param {Object} req Request object
     */
    getEndpoint(req) {
        const urlString = req.baseUrl
        const urlPaths = urlString.split('/')
        
        return urlPaths[4].toLowerCase()
    }

    // Generates port for server to listen on
    #generatePort() {
        return Math.floor(Math.random() * 10000)
    }

    // Utility method to return major version
    #getMajorVersion(version) {
        const strings = version.split('.')

        return strings[0]
    }

    // Initialize routes
    #initRoutes(app, defaultRouter, customRouter) {
        console.log(this.#consoleColor, 'Initializing routes...')

        // Index route
        app.use(`${this.baseURL}/`, index)
        
        // JWT route
        app.use(`${this.baseURL}/get-token`, (this.show_token) ? token : (req, res) => {
            return this.respond(404, res)
        })

        // Custom routes
        app.use(`${this.baseURL}/custom`, (customRouter) ? customRouter : (req, res) => {
            return this.respond(404, res)
        })

        // Default routes
        app.use(`${this.baseURL}/:resource`, defaultRouter)
    }

    // Initialize middlewares
    #initMiddlewares(app) {
        console.log(this.#consoleColor, 'Initializing middlewares...')

        app.use(cors({
            origin: this.cors_origins,
            optionsSuccessStatus: 200 
        }))
    
        app.use(express.json({ limit: '2mb' }))
        app.use(express.urlencoded({ extended: true, limit: '2mb' }))
    
        app.use(
            helmet({
                contentSecurityPolicy: false,
                xDownloadOptions: false,
            })
        )

        // Set jwt secret key in req object
        app.use((req, res, next) => {
            req.jwt_secret = this.jwt_secret

            next()
        })

        // Report downtime if maintenance mode is turned on
        app.use((req, res, next) => {
            if (this.maintenance) {
                return getResponse(503, res)
            } else {
                next()
            }
        })
        
        // Decide which authentication middleware to use
        if (!this.disable_auth) {
            app.use(auth)
        }
    }

    // Initialize database
    async #initDB() {
        console.log(this.#consoleColor, 'Initializing database connection...')

        return await mongoose
            .connect(this.db_server)
            .then((response) => {
                return response
            })
            .catch((err) => {
                console.log(err)
            })
    }

    // Initialize config
    #initConfig(app) {
        console.log(this.#consoleColor, 'Initializing config...')

        app.keepAliveTimeout = (this.config.keepAliveTimeout) ? this.config.keepAliveTimeout : 120 * 1000
        app.headersTimeout = (this.config.headersTimeout) ? this.config.headersTimeout : 120 * 1000
    }
}