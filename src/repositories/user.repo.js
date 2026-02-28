const { query } = require('../config/db.conf');

const findUserByEmail = (email) =>
    query("SELECT * FROM users WHERE email = $1", [email]);

const findUserById = (user_id) =>
    query("SELECT * FROM users WHERE id = $1", [user_id]);

const insertUser = ({ email, password, username, name, role }) => {

    return query(
        "INSERT INTO users (email, password, username, name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email",
        [email, password, username, name, role]
    );
}
const insertSessions = ({ user_id, status }) => {
    return query("INSERT INTO sessions (user_id, status) VALUES ($1, $2) RETURNING id", [user_id, status])
}

const updateSessions = ({ id, refresh_token }) => {
    return query(
        `   UPDATE sessions
            SET refresh_token = $2
            WHERE id = $1
            AND status = 'active'
            RETURNING user_id, id AS session_id
        `,
        [id, refresh_token]
    )
}

const getActiveSession = (user_id) => {
    return query(
        'SELECT id FROM sessions WHERE user_id = $1 AND status = $2 LIMIT 1',
        [user_id, 'active']
    );
}

const revokeSession = (session_id) => {
    return query(
        `
            UPDATE sessions
            SET status = $1
            WHERE id = $2
            RETURNING user_id
        `,
        ['expired', session_id]
    )
}
module.exports = { findUserByEmail, insertUser, insertSessions, updateSessions, getActiveSession, findUserById, revokeSession };