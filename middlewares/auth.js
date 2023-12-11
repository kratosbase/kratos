import getResponse from "../helpers/responseHelper.js"

export default function (req, res, next) {
    if (req.headers.authorization) {
        // Todo: validate bearer token
        next()
    } else {
        return getResponse(401, res)
    }
}