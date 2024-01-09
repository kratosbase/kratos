import express from 'express'
import getResponse from "../helpers/responseHelper.js"
import jwt from 'jsonwebtoken'
import fs from 'fs'
import { createHash } from 'crypto'

const router = express.Router()

router.get('/', async (req, res) => {
    const role = (req.params.role) ? req.params.role : 'default'
    const privateKey = fs.readFileSync('private.key')
    const token = jwt.sign({ role }, privateKey, { algorithm: 'RS256' })
    const publicKey = fs.readFileSync('private.key.pub')
    const public_key = createHash('sha256').update(publicKey).digest('hex')
    
    return getResponse(200, res, { token, public_key })
})

export default router