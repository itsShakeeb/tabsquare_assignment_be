const { Client } = require('pg')

require('dotenv').config();
const {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_DATABASE,
} = process.env;

const createDatabase = async () => {

    const client = new Client({
        user: DB_USER,
        password: DB_PASSWORD,
        host: DB_HOST,
        port: DB_PORT,
        database: 'postgres', // connect to postgres system DB first
    })
    try {
        await client.connect()
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [DB_DATABASE])
        if (res.rowCount === 0) {
            console.log(`Database "${DB_DATABASE}" does not exist. Creating...`);
            await client.query(`CREATE DATABASE ${DB_DATABASE}`);
            console.log(`Database "${DB_DATABASE}" created successfully ✅`);
        } else {
            console.log(`Database "${DB_DATABASE}" already exists ✅`);
        }
    } catch (err) {
        console.error('Error checking/creating database:', err);
    } finally {
        await client.end();

    }

}

createDatabase()