import express from 'express'
import getResponse from "../helpers/responseHelper.js"
import * as jwt from 'jsonwebtoken'
import * as fs from 'fs'

const router = express.Router()

router.get('/', async (req, res) => {
    const admin = (req.params.admin) ? req.params.admin : false
    const file = fs.readFileSync('private.key')
    const token = jwt.default.sign({ admin }, file, { algorithm: 'RS256' })
    
    return getResponse(200, res, { token })
})

export default router