const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const crypto = require('crypto')

dotenv.config()

const createJWT = async ({ user_id, role, session_id }) => {
    return jwt.sign({ sub: user_id, role, sid: session_id }, process.env.JWT_SECRET, { algorithm: 'HS256', issuer: 'cloud_kitchen', expiresIn: '1hr', })
}

const verifyJWT = async (token) => {
    return jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ['HS256'],
        issuer: 'cloud_kitchen',

    })
}

module.exports = {
    createJWT,
    verifyJWT

}