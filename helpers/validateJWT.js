import jwt from 'jsonwebtoken'
import * as fs from 'fs'
import { createHash } from 'crypto'

export default function validateJWT(token, pub_key) {
    const cert = fs.readFileSync('private.key.pub')
    const hash = createHash('sha256').update(cert).digest('hex')

    if (pub_key !== hash) {
        return false
    } else {
        return jwt.verify(token, cert, { algorithms: ['RS256'] }, function(err, payload) {
            if (err) {
                return false
            } else {
                return payload
            }
        })
    }
}