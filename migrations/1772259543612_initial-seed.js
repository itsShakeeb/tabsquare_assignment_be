/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
require('dotenv').config();
const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const up = (pgm) => {
    pgm.createExtension('pgcrypto', { ifNotExists: true });

    pgm.createTable('users', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        role: {
            type: 'text',
            notNull: true,
            default: 'buyer',
            check: "role IN ('admin','buyer')",
        },
        name: { type: 'varchar(120)', notNull: true },
        email: { type: 'varchar(255)', notNull: true, unique: true },
        phone_no: { type: 'varchar(20)', notNull: true, unique: true },
        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        },
    });

    pgm.createTable('category', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        name: { type: 'varchar(100)', notNull: true, unique: true },
    });

    pgm.createTable('dietary', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        name: { type: 'varchar(100)', notNull: true, unique: true },
    });

    pgm.createTable('item', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        name: { type: 'varchar(255)', notNull: true },
        description: { type: 'text' },
        image: { type: 'text' },
        base_price: { type: 'numeric(10,2)', notNull: true },
        preparation_time: { type: 'smallint' },
        is_available: { type: 'boolean', default: true },
        category_id: {
            type: 'uuid',
            references: 'category(id)',
            onDelete: 'cascade',
        },
        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        },
    });

    pgm.createTable('item_dietary', {
        item_id: {
            type: 'uuid',
            references: 'item(id)',
            onDelete: 'cascade',
        },
        dietary_id: {
            type: 'uuid',
            references: 'dietary(id)',
            onDelete: 'cascade',
        },
    }, {
        constraints: {
            primaryKey: ['item_id', 'dietary_id'],
        },
    });

    pgm.createTable('add_ons', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        name: { type: 'varchar(255)', notNull: true },
        price: { type: 'numeric(10,2)', notNull: true },
    });

    pgm.createTable('cart', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        user_id: {
            type: 'uuid',
            notNull: true,
            references: 'users(id)',
            onDelete: 'cascade',
        },
        created_at: {
            type: 'timestamptz',
            default: pgm.func('now()'),
        },
    });

    pgm.createTable('cart_items', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        cart_id: {
            type: 'uuid',
            notNull: true,
            references: 'cart(id)',
            onDelete: 'cascade',
        },
        item_id: {
            type: 'uuid',
            notNull: true,
            references: 'item(id)',
        },
        quantity: { type: 'smallint', notNull: true },
        size: {
            type: 'text',
            check: "size IN ('regular','medium','large')",
        },
        instruction: { type: 'text' },
    });

    pgm.createTable('cart_item_add_ons', {
        cart_item_id: {
            type: 'uuid',
            references: 'cart_items(id)',
            onDelete: 'cascade',
        },
        add_on_id: {
            type: 'uuid',
            references: 'add_ons(id)',
            onDelete: 'cascade',
        },
    }, {
        constraints: {
            primaryKey: ['cart_item_id', 'add_on_id'],
        },
    });

    pgm.createTable('orders', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        customer_id: {
            type: 'uuid',
            notNull: true,
            references: 'users(id)',
        },
        status: {
            type: 'text',
            notNull: true,
            default: 'received',
            check: "status IN ('received','preparing','ready','completed')",
        },
        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        },
        updated_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        },
    });

    pgm.createTable('order_items', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        order_id: {
            type: 'uuid',
            notNull: true,
            references: 'orders(id)',
            onDelete: 'cascade',
        },
        item_id: {
            type: 'uuid',
            notNull: true,
            references: 'item(id)',
        },
        quantity: { type: 'smallint', notNull: true },
        size: {
            type: 'text',
            check: "size IN ('regular','medium','large')",
        },
        instruction: { type: 'text' },
        price_at_purchase: {
            type: 'numeric(10,2)',
            notNull: true,
        },
    });

    pgm.createTable('order_item_add_ons', {
        order_item_id: {
            type: 'uuid',
            references: 'order_items(id)',
            onDelete: 'cascade',
        },
        add_on_id: {
            type: 'uuid',
            references: 'add_ons(id)',
        },
    }, {
        constraints: {
            primaryKey: ['order_item_id', 'add_on_id'],
        },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {

    exports.down = (pgm) => {
        pgm.dropTable('order_item_add_ons');
        pgm.dropTable('order_items');
        pgm.dropTable('orders');
        pgm.dropTable('cart_item_add_ons');
        pgm.dropTable('cart_items');
        pgm.dropTable('cart');
        pgm.dropTable('item_dietary');
        pgm.dropTable('add_ons');
        pgm.dropTable('item');
        pgm.dropTable('dietary');
        pgm.dropTable('category');
        pgm.dropTable('users');
    };
};


module.exports = {
    up,
    down,
    shorthands
}