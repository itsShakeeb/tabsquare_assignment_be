const userService = require('../services/user.service');
const { COOKIE_MAX_AGE } = require('../utils/constant');

const createUserController = async (req, res) => {
    const { email, password, phone_no, name, role } = req.body
    const body = { email, password, phone_no, name, role }
    try {
        const user = await userService.createUser(body);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const loginUserController = async (req, res) => {
    const { email, password } = req.body
    try {
        const { refresh_token, ...rest } = await userService.loginUser({ email, password })
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: COOKIE_MAX_AGE,
        });
        res.status(200).json(rest)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const logoutUserController = async (req, res) => {
    const { user } = req
    try {
        await userService.logoutUser({ session_id: user.sid })
        res.clearCookie('refresh_token');
        res.status(200).json({ msg: 'Log out successfully' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }


}
module.exports = {
    createUserController,
    loginUserController,
    logoutUserController
}