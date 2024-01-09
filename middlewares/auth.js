import getResponse from "../helpers/responseHelper.js"
import validateJWT from "../helpers/validateJWT.js"

export default function (req, res, next) {
    if (endpoint(req.path) === 'get-token') {
        next()
    } else if (req.headers.authorization && req.headers.public_key) {
        // validate token and pub key
        const token = req.headers.authorization
        const pub_key = req.headers.public_key
        const payload = validateJWT(token, pub_key)

        if (payload) {
            req.userRole = payload.role
            next()
        } else {
            return getResponse(401, res)
        }
    } else {
        return getResponse(401, res)
    }
}

function endpoint(path) {
    const pathArray = path.split('/')
    return pathArray[3]
}