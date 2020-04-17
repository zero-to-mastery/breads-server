require('dotenv').config();
let mysql = require('mysql');

let connection = mysql.createConnection({
    host: process.env.CLEARDB_MYSQL_URI || process.env.HOST,
    user: process.env.USER || 'root',
    password: process.env.DBPASSWORD || 'Basebal6',
    database: process.env.DB || 'articly'
});

module.exports.connection = connection;

// ************SCHEMAS************

// CREATE TABLE users (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     first_name VARCHAR(255) NOT NULL,
//     last_name VARCHAR(255) NOT NULL,
//     email VARCHAR(255) UNIQUE NOT NULL,
//     username VARCHAR(255) UNIQUE NOT NULL,
//     password VARCHAR(255),
//     image VARCHAR(255),
//     created_at TIMESTAMP DEFAULT NOW()
// );

// CREATE TABLE readings (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     title VARCHAR(255) NOT NULL,
//     domain VARCHAR(255) NOT NULL,
//     word_count INT NOT NULL,
//     url VARCHAR(255) UNIQUE NOT NULL,
//     user_id INT NOT NULL,
//     created_at TIMESTAMP DEFAULT NOW(),
//     FOREIGN KEY(user_id) REFERENCES users(id)
// );

// CREATE TABLE subscriptions (
//     subscriber_id INT NOT NULL,
//     publisher_id INT NOT NULL,
//     created_at TIMESTAMP DEFAULT NOW(),
//     FOREIGN KEY(subscriber_id) REFERENCES users(id),
//     FOREIGN KEY(publisher_id) REFERENCES users(id),
//     PRIMARY KEY(subscriber_id, publisher_id)
// );