const { findUserByEmail, insertUser, insertSessions, updateSessions, getActiveSession, revokeSession } = require('../repositories/user.repo');
const { getHashedPassword, comparePassword } = require('../utils/password');
const { createJWT, getNewHashedRefreshToken, getNewRefreshToken } = require('../utils/token');


const createUser = async (body) => {
    const existing = await findUserByEmail(body.email);
    if (existing.rows.length > 0) {
        throw new Error("User already exists");
    }

    const hashedPassword = await getHashedPassword(body.password);
    body.password = hashedPassword
    return (await insertUser(body)).rows[0];
}
const loginUser = async ({ email, password }) => {
    const existing = await findUserByEmail(email);
    if (existing.rows.length === 0) {
        throw new Error('User not registered');
    }

    const user = existing.rows[0];

    const isPasswordMatched = await comparePassword(password, user.password);
    if (!isPasswordMatched) {
        throw new Error('Incorrect email or password');
    }

    const activeSession = await getActiveSession(user.id)

    let session_id;
    if (activeSession.rows.length > 0) {
        session_id = activeSession.rows[0].id;
    } else {

        const newSession = await insertSessions({ user_id: user.id, status: 'active' });
        session_id = newSession.rows[0].id;
    }

    const accessToken = await createJWT({ user_id: user.id, role: user.role, session_id });

    const refreshTokenPlain = getNewRefreshToken();
    const refreshTokenHash = getNewHashedRefreshToken(refreshTokenPlain);

    await updateSessions({ id: session_id, refresh_token: refreshTokenHash });

    return {
        user_id: user.id,
        role: user.role,
        access_token: accessToken,
        refresh_token: refreshTokenPlain,
    };
};

const logoutUser = async ({ session_id }) => {

    return (await revokeSession(session_id)).rows[0]
}

module.exports = {
    createUser,
    loginUser,
    logoutUser
}