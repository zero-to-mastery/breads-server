let db = require('.'),
    { PythonShell } = require('python-shell');

class Reading {
    constructor(id, title, domain, description, image, word_count, url, user_id) {
        this.id = id,
        this.title = title,
        this.domain = domain,
        this.description = description,
        this.image = image,
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

        let createdResult = reading.then(data => {
            let values = JSON.parse(data[0]);
            let query = new Promise(function (resolve, reject) {
                db.connection.query('INSERT INTO readings SET ?', values, function (err, results) {
                    if (err) reject(err);
                    else resolve(results);
                });
            });
            return query;
        });

        return createdResult;
    }

    static findById(id) {
        let reading = new Promise(function (resolve, reject) {
            db.connection.query('SELECT * FROM readings WHERE id = ?', id, function (err, results) {
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
            db.connection.query('SELECT readings.id, title, domain, description, readings.image as readings_image, word_count, url, readings.created_at, readings.user_id, username, users.image, favorites.user_id as favorite FROM readings LEFT JOIN users ON users.id = readings.user_id LEFT JOIN favorites on favorites.reading_id = readings.id ORDER BY readings.id DESC', function (err, results) {
                if (err) reject(err);
                else resolve(results);
            });
        });
        return readings;
    }

    static findByUserId(id) {
        let userReadings = new Promise(function(resolve, reject) {
            db.connection.query('SELECT readings.id, title, domain, description, readings.image as readings_image, word_count, url, readings.created_at, readings.user_id, username, users.image, favorites.user_id as favorite FROM readings LEFT JOIN users ON users.id = readings.user_id LEFT JOIN favorites on favorites.reading_id = readings.id WHERE readings.user_id = ? ORDER BY readings.id DESC', id, function(err, results) {
                if (err) reject(err);
                return resolve(results);
            });
        });
        return userReadings;
    }

    static findSubReadings(sub_id) {
        let subscriptionReadings = new Promise((resolve, reject) => {
            db.connection.query('SELECT readings.id, title, domain, description, readings.image as readings_image, word_count, url, readings.created_at, username, users.image, readings.user_id, favorites.user_id as favorite FROM subscriptions INNER JOIN readings ON publisher_id = readings.user_id LEFT JOIN favorites on favorites.reading_id = readings.id INNER JOIN users ON readings.user_id = users.id WHERE subscriber_id = ? ORDER BY readings.id DESC', sub_id, function(err, results) {
                if (err) reject(err);
                else resolve(results);
            });
        });
        return subscriptionReadings;
    }

    static findFavoriteReadings(id) {
        let favoriteReadings = new Promise((resolve, reject) => {
            db.connection.query('SELECT readings.id, title, domain, description, readings.image as readings_image, word_count, url, readings.created_at, readings.user_id, username, users.image, favorites.user_id as favorite FROM readings LEFT JOIN users ON users.id = readings.user_id LEFT JOIN favorites on favorites.reading_id = readings.id WHERE favorites.user_id = ? ORDER BY readings.id DESC;', id, function(err, results) {
                if (err) reject(err);
                return resolve(results);
            });
        });
        return favoriteReadings;
    }

    static markFavorite(id, user_id) {
        let favorite = new Promise((resolve, reject) => {
            db.connection.query('INSERT INTO favorites (user_id, reading_id) VALUES (?, ?)', [user_id, id], function(err, results) {
                if (err) reject(err);
                else resolve(results);
            });
        });
        return favorite;
    }

    static deleteFavorite(id, user_id) {
        let favorite = new Promise((resolve, reject) => {
            db.connection.query('DELETE FROM favorites WHERE user_id = ? AND reading_id = ?', [user_id, id], function(err, results) {
                if (err) reject(err);
                else resolve(results);
            });
        });
        return favorite;
    }

    static delete(id) {
        let deletedReading = new Promise((resolve, reject) => {
            db.connection.query('DELETE FROM readings WHERE id = ?', id, function(err, results) {
                if (err) reject(err);
                else resolve(results);
            });
        });
        return deletedReading;
    }

    static update(url, user_id, reading_id) {
        let options = { args: [url, user_id] };
        let reading = new Promise((resolve, reject) => {
            PythonShell.run('reading_scraper.py', options, function (err, data) {
                if (err) reject(err);
                return resolve(data);
            });
        })

        let updateResult = reading.then(data => {
            let values = JSON.parse(data[0]);
            console.log(values);
            let query = new Promise(function (resolve, reject) {
                db.connection.query('UPDATE readings SET ? WHERE id = ?', [values, reading_id], function (err, results) {
                    if (err) reject(err);
                    else resolve(results);
                });
            });
            return query;
        });
        
        return updateResult;
    }

    static findIdByUrl(url) {
        let id = new Promise((resolve, reject) => {
            db.connection.query('SELECT id FROM readings WHERE url = ?', url, function(err, results) {
                if (err) reject(err);
                else resolve(results);
            });
        });
        return id;
    }
}

module.exports = Reading;