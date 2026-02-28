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
    pgm.createType('session_status', ['active', 'expired'])
    pgm.createTable('sessions', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        refresh_token: {
            type: 'text',
            notNull: false,
        },
        user_id: {
            type: 'uuid',
            default: null,
            references: 'users',
        },
        status: {
            type: 'session_status',
            notNull: true,
            default: 'active',
        },
        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        },
        updated_at: {
            type: 'timestamptz',
            default: pgm.func('now()'),
        },
    })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
    pgm.dropTable('sessions');
    pgm.dropType('session_status');
};

module.exports = {
    shorthands,
    up,
    down
}