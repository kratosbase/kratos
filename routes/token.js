import express from 'express'
import getResponse from "../helpers/responseHelper.js"
import jwt from 'jsonwebtoken'

const router = express.Router()

router.get('/', async (req, res) => {
    if (req.query.id) {
        const role = (req.query.role) ? req.query.role : 'default'
        const id = req.query.id
        const secret = req.jwt_secret
        const token = jwt.sign({ role, id }, secret)
        
        return getResponse(200, res, { token })
    } else {
        return getResponse(400, res, { message: 'user id is required!'})
    }
})

export default router