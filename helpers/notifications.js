let db = require('../models');

exports.findSubscriptionsByUserId = user_id => {  
    let newSubscriber = new Promise((resolve, reject) => {
        db.connection.query('SELECT username, publisher_id, subscriber_id FROM users INNER JOIN subscriptions ON subscriber_id = users.id WHERE isNew = 1 AND publisher_id = ?', user_id, function(err, results) {
            if (err) reject(err);
            else resolve(results);
        });
    });
    return newSubscriber;
}

exports.remove = user_id => {
    let oldNotification = new Promise((resolve, reject) => {
        db.connection.query('UPDATE subscriptions SET isNew = 0 WHERE publisher_id = ?', user_id, function(err, results) {
            if (err) reject(err);
            else resolve(results);
        });
    });
    return oldNotification;
}