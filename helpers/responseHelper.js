// Return HTTP response object based on HTTP status code

export default function getResponse(status, res, data) {
    switch (status) {
        case 200:
            if (Array.isArray(data) || typeof data === 'object') {
                return res.status(status).json({
                    status,
                    message: 'ok',
                    data
                })
            } else {
                return res.status(status).json({
                    status,
                    message: 'ok'
                })
            }
            break
            
        case 400:
            return res.status(status).json({
                status,
                message: 'bad request'
            })
            break

        case 401:
            return res.status(status).json({
                status,
                message: 'unauthorized'
            })
            break
    
        case 404:
            return res.status(status).json({
                status,
                message: 'resource not found'
            })
            break

        case 500:
            return res.status(status).json({
                status,
                message: 'internal server error'
            })
            break
        
        case 503:
            return res.status(status).json({
                status,
                message: 'service unavailable'
            })
            break

        case 'duplicate':
            return res.status(400).json({
                status: 400,
                message: 'duplicate or empty data provided'
            })
            break
        default:
            break;
    }
}