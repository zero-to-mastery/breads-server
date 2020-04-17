let db = require('../models'),
    { PythonShell } = require('python-shell');

// UPDATE, DELETE
exports.create = (url, id) => {
    let options = { args: [url, id] };
    let reading = new Promise((resolve, reject) => {
        PythonShell.run('reading_scraper.py', options, function (err, data) {
            if (err) reject(err);
            return resolve(data);
        });
    })
    return reading;
}

exports.findById = id => {
    let reading = new Promise(function (resolve, reject) {
        db.connection.query('SELECT * FROM readings WHERE id = ?', id, function (err, results) { //readings
            if (err) reject(err);
            else resolve(results);
        });
    });
    return reading;
}

exports.summarize = url => {
    let options = { args: [url] };
    let summary = new Promise((resolve, reject) => {
        PythonShell.run('reading_summary.py', options, function (err, data) {
            if (err) reject(err);
            return resolve(data);
        });
    });
    return summary;
}

exports.findAll = () => {
    let readings = new Promise(function (resolve, reject) {
        // FORMAT(word_count, 0)
        db.connection.query('SELECT readings.id, title, domain, word_count, url, readings.user_id, username, image FROM readings LEFT JOIN users ON users.id = readings.user_id ORDER BY readings.id DESC', function (err, results) {
            if (err) reject(err);
            else resolve(results);
        });
    });
    return readings;
}

exports.findByUserId = userId => {
    let id = new Promise(function(resolve, reject) {
        db.connection.query('SELECT readings.id, title, domain, word_count, url, readings.user_id, username, image FROM readings LEFT JOIN users ON users.id = readings.user_id WHERE user_id = ? ORDER BY readings.id DESC', userId, function(err, results) {
            if (err) reject(err);
            return resolve(results);
        });
    });
    return id;
}

// exports.findByUsername = username => {
//     let id = new Promise(function(resolve, reject) {
//         db.connection.query('SELECT readings.id, title, domain, word_count, url, readings.user_id, username, image FROM readings LEFT JOIN users ON users.id = readings.user_id WHERE user_id = ? ORDER BY readings.id DESC', userId, function(err, results) {
//             if (err) reject(err);
//             return resolve(results);
//         });
//     });
//     return id;
// }

exports.delete = id => {
    let user = new Promise((resolve, reject) => {
        db.connection.query('DELETE FROM readings WHERE id = ?', id, function(err, results) {
            if (err) reject(err);
            else resolve(results);
        });
    });
    return user;
}



// *************************************************
// *******************OLD QUERIES*******************
// *************************************************

// exports.create = async (url, id) => {
//     let reading = new Promise(function (resolve, reject) {
//         db.connection.query('INSERT INTO readings SET ?', [url, id], function(err, results) {
//             if (err) reject(err);
//             return resolve(results);
//         })
//     });
//     return reading;
// }