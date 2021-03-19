require('dotenv').config();
const mysql = require('mysql2');

const localSetup = {
    connectionLimit: 25,
    host: process.env.HOST || process.env.LOCAL_HOST,
    user: process.env.USERNAME || process.env.LOCAL_USER,
    password: process.env.DBPASSWORD || process.env.LOCAL_DBPASSWORD,
    database: process.env.DB || process.env.LOCAL_DB
}

const connection = mysql.createPool(localSetup);

module.exports.connection = connection;