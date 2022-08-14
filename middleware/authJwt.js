const jwt = require("jsonwebtoken")
const authConfig = require('../config/auth.config')
const db = require('../models')
const User = db.users

verifyToken = async (req, res, next) => {
    try {
        let token = req.header('Authorization').replace('Bearer ', '')

        const decoded = jwt.verify(token, authConfig.secret)

        let user = await User.findAll({
            where: {
                address: decoded.address
            }
        })

        if (user) {
            req.address = decoded.address
        }
        next()
    } catch (err) {
        res.send('Invalid token')
    }
}

module.exports = {
    verifyToken
}