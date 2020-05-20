let db = require('.'),
    { PythonShell } = require('python-shell');

class Reading {
    constructor(id, title, domain, word_count, url, user_id) {
        this.id = id,
        this.title = title,
        this.domain = domain,
        this.word_count = word_count,
        this.url = url,
        this.user_id = user_id
    }
    
    static create(url, id) {
        let options = { args: [url, id] };
        let reading = new Promise((resolve, reject) => {
            PythonShell.run('reading_scraper.py', options, function (err, data) {
                if (err) reject(err);
                return resolve(data);
            });
        })
        return reading;
    }

    static findById(id) {
        let reading = new Promise(function (resolve, reject) {
            db.connection.query('SELECT * FROM readings WHERE id = ?', id, function (err, results) { //readings
                if (err) reject(err);
                else resolve(results);
            });
        });
        return reading;
    }

    static summarize(url) {
        let options = { args: [url] };
        let summary = new Promise((resolve, reject) => {
            PythonShell.run('reading_summary.py', options, function (err, data) {
                if (err) reject(err);
                return resolve(data);
            });
        });
        return summary;
    }

    static findAll() {
        let readings = new Promise(function (resolve, reject) {
            // FORMAT(word_count, 0)
            db.connection.query('SELECT readings.id, title, domain, word_count, url, readings.created_at, readings.user_id, username, image FROM readings LEFT JOIN users ON users.id = readings.user_id ORDER BY readings.id DESC', function (err, results) {
                if (err) reject(err);
                else resolve(results);
            });
        });
        return readings;
    }

    static findByUserId(id) {
        let userReadings = new Promise(function(resolve, reject) {
            db.connection.query('SELECT readings.id, title, domain, word_count, url, readings.created_at, readings.user_id, username, image FROM readings LEFT JOIN users ON users.id = readings.user_id WHERE user_id = ? ORDER BY readings.id DESC', id, function(err, results) {
                if (err) reject(err);
                return resolve(results);
            });
        });
        return userReadings;
    }

    static findWebsites() {
        let websites = new Promise((resolve, reject) => {
            db.connection.query('SELECT domain FROM readings GROUP BY domain ORDER BY COUNT(domain) DESC', function(err, results) {
                if (err) reject(err);
                return resolve(results);
            });
        });
        return websites;
    }

    static findWebsitesByUserId(id) {
        let websites = new Promise((resolve, reject) => {
            db.connection.query('SELECT domain FROM readings WHERE user_id = ? GROUP BY domain ORDER BY COUNT(domain) DESC', id, function(err, results) {
                if (err) reject(err);
                return resolve(results);
            });
        });
        return websites;
    }

    static delete(id) {
        let user = new Promise((resolve, reject) => {
            db.connection.query('DELETE FROM readings WHERE id = ?', id, function(err, results) {
                if (err) reject(err);
                else resolve(results);
            });
        });
        return user;
    }
}

module.exports = Reading;