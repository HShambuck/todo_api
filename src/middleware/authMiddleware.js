import jwt from 'jsonwebtoken'

function authMiddleware (req, res, next) {
    const token = req.headers['authorization']

    if(!token) return res.status(401).send('<h1>No token provided</h>')

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) return res.status(401).send('<h1>Invalid token</h1>')

        req.userId = decoded.id
        next()
    })
}

export default authMiddleware