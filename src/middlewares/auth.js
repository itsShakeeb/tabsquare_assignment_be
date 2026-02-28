const { getActiveSession } = require("../repositories/user.repo");
const { verifyJWT } = require("../utils/token")

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header missing' });
        }

        const token = authHeader.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Auth token not provided' });
        }

        const user = await verifyJWT(token)
        const session_id = user.sid;
        if (!session_id) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        const activeSession = await getActiveSession(user.sub);

        if (!activeSession.rows.length) {
            return res.status(401).json({ error: 'Invalid token: session not found' });
        }
        req.user = user;

        next();
    } catch (err) {
        console.error('JWT verification failed:', err.message);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

module.exports = {
    auth
}