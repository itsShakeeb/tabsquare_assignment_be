const bcryptjs = require('bcryptjs')

const saltRounds = 10;
const getHashedPassword = (password) => bcryptjs.hash(password, saltRounds)
const comparePassword = (password, hashedPassword) => bcryptjs.compare(password, hashedPassword)

module.exports = {
    getHashedPassword,
    comparePassword
}