import getResponse from "../helpers/responseHelper.js"
import validateJWT from "../helpers/validateJWT.js"

export default function (req, res, next) {
    if (endpoint(req.path) === 'get-token' || endpoint(req.path) === 'show-secret' || path_in_paths('/' + endpoint(req.path), req.unprotected_routes)) {
        next()
    } else if (req.headers.authorization) {
        // validate token
        const token = req.headers.authorization
        const secret = req.jwt_secret

        const payload = validateJWT(token, secret)

        if (payload) {
            req.userRole = (payload.role) ? payload.role : 'default'
            
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

    const startIndex = 3
    const slicedArray = pathArray.slice(startIndex)

    // Join the array values into a single string
    return slicedArray.join('/')
}

function path_in_paths(path, paths) {
    return paths.find(route => route == path)
}