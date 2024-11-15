import jwt from 'jsonwebtoken'

export default function validateJWT(token, secret_key) {
    return jwt.verify(token, secret_key, function(err, payload) {
        if (err) {
            return false
        } else {
            return payload
        }
    })
}

export function generateJWT(id, role, secret) {
    return jwt.sign({ role, id }, secret)
}