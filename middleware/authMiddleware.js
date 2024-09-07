const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {
    const token = req.header('Authorization')

    if(!token) return res.status(401).json({ error: 'Access denied' })

    try {
        console.log(token)
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.userId = decoded.userId
        next()
    }catch(ex) {
        res.status(401).json({ 'message': "Invalid Token"})
    }
}

module.exports = verifyToken