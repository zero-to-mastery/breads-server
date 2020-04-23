let db = require('../models');

// some are subscription readings others are subscription user cards
exports.create = (user_id, sub_id) => {  
    let subscription = new Promise((resolve, reject) => {
        db.connection.query('INSERT INTO subscriptions SET ?', [user_id, sub_id], function(err, results) {
            if (err) reject(err);
            else resolve(results);
        });
    });
    return subscription;
}

exports.findSubReadings = sub_id => {
    let subscriptionReadings = new Promise((resolve, reject) => {
        db.connection.query('SELECT readings.id, title, domain, word_count, url, username, image, user_id FROM subscriptions INNER JOIN readings ON publisher_id = readings.user_id INNER JOIN users ON readings.user_id = users.id WHERE subscriber_id = ? ORDER BY readings.id DESC', sub_id, function(err, results) {
            if (err) reject(err);
            else resolve(results);
        });
    });
    return subscriptionReadings;
}

exports.findBySubId = sub_id => {
    let subscription = new Promise((resolve, reject) => {
        db.connection.query('SELECT * FROM subscriptions WHERE subscriber_id = ?', sub_id, function(err, results) {
            if (err) reject(err);
            else resolve(results);
        });
    });
    return subscription;
}

exports.delete = (user_id, sub_id) => {
    let subscription = new Promise((resolve, reject) => {
        db.connection.query('DELETE FROM subscriptions WHERE subscriber_id = ? AND publisher_id = ?', [user_id, sub_id], function(err, results) {
            if (err) reject(err);
            else resolve(results);
        });
    });
    return subscription;
}