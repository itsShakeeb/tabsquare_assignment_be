/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const up = (pgm) => {

    pgm.addIndex('sessions', 'user_id', { name: 'idx_sessions_user' });

    pgm.addIndex('sessions', 'user_id', {
        name: 'unique_active_session_per_user',
        unique: true,
        where: "status = 'active'",
    });

    pgm.addConstraint('sessions', 'sessions_status_check', {
        check: "status IN ('active', 'expired')",
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
    pgm.dropConstraint('sessions', 'sessions_status_check');
    pgm.dropIndex('sessions', 'user_id', { name: 'unique_active_session_per_user' });
    pgm.dropIndex('sessions', 'user_id', { name: 'idx_sessions_user' });
};

module.exports = {
    shorthands,
    up,
    down
}