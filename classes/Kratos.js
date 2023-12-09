import express from 'express'
import Router from './Router.js'
import mongoose from "mongoose"
import cors from 'cors'
import helmet from 'helmet'
import index from '../routes/index.js'

/**
 * Kratos class
 */
export default class Kratos {
    app = express()
    #localConfig = {
        port: this.#generatePort(),
        version: 1
    }

    constructor(config) {
        /**
         * Initialize a new Kratos instance.
         * 
         * @param config The default config for Kratos initialization
         */
        this.config = config
        this.port = parseInt(this.config.port)
        this.version = (this.config.version) ? this.#getMajorVersion(this.config.version) : this.#localConfig.version
        this.baseURL = `/api/v${this.version}`
        this.db_server = this.config.db_server
        this.app
    }

    /**
     * Serve the Kratos application
     *
     * @param {Object} routes Routes object
     */
    launch(routes) {
        // Initialize middlewares
        this.#initMiddlewares(this.app)

        // Initialize config
        this.#initConfig(this.app)

        // Initialize routes
        this.#initRoutes(this.app, routes)

        // Initialize DB
        this.#initDB(this.app)
        .then(() => {
            this.app.listen(this.port, () => console.log(`Kratos app is running on port: ${this.port}`))
        })
    }

    /**
     * Router class
     *
     * @param {Object} models Models object
     */
    router(models) {
        return new Router(models)
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
    #initRoutes(app, routes) {
        console.log('Initializing routes...')

        app.use(`${this.baseURL}/`, index)
        app.use(`${this.baseURL}/:resource`, routes)
    }

    // Initialize middlewares
    #initMiddlewares(app) {
        app.use(cors({
            origin: process.env.CORS_ORIGINS,
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
    }

    // Initialize database
    async #initDB(app) {
        console.log('Initializing database...')

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
        app.keepAliveTimeout = (this.config.keepAliveTimeout) ? this.config.keepAliveTimeout : 120 * 1000
        app.headersTimeout = (this.config.headersTimeout) ? this.config.headersTimeout : 120 * 1000
    }
}