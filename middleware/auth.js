const jwt = require('jsonwebtoken');

module.exports = function(req, res, next){
    //verify jwt token
    const token = req.header('x-auth-token');

    //check if token not
    if(!token){
        return res.status(401).json({msg: 'No token , Authorization Denied'})
    }

    //verify token
    try {
        const decoded = jwt.verify(token, process.env.JWTKEY)
        req.user = decoded.user;
        next()
    } catch (error) {
        res.status(401).json({msg: "Token is not valid"})
    }

}
