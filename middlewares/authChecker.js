// WIP
export default function authChecker(req, res, next) {
    if (req.authenticated === true) {
        next()
    } else {
        // res.status(401).json({
        //     status: 401,
        //     message: 'unauthorized',
        //     data: {
        //         authenticated: false
        //     }
        // })
        next()
    }   
}