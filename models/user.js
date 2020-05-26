let db = require('.'),
    bcrypt = require('bcrypt');

class User {
    constructor(firstName, lastName, username, email, password, image) {
        this.first_name = firstName,
        this.last_name = lastName,
        this.username = username,
        this.email = email,
        this.password = password,
        this.image = image
    }

    static create(user) {
        let salt = bcrypt.genSaltSync(10),
            hash = bcrypt.hashSync(user.password, salt);
        
        user.password = hash;
        let newUser = new Promise((resolve, reject) => {
            db.connection.query('INSERT INTO users SET ?', user, function (err, results) {
                if (err) reject(err);
                else resolve(results);
            });
        });
        return newUser;
    }

    static findByUsername(username) {
        let user = new Promise((resolve, reject) => {
            db.connection.query('SELECT * FROM users WHERE username = ?', username, function(err, results) {
                if (err) reject(err);
                else resolve(results);  
            });
        });
        return user;
    }
    
    static findById(id) {
        let user = new Promise((resolve, reject) => {
            db.connection.query('SELECT id, username, image FROM users WHERE id = ?', id, function(err, results) {
                if (err) reject(err);
                else resolve(results);  
            });
        });
        return user;
    }

    static findByEmail(email) {
        let user = new Promise((resolve, reject) => {
            db.connection.query('SELECT * FROM users WHERE email = ?', email, function(err, results) {
                if (err) reject(err);
                else resolve(results);  
            });
        });
        return user;
    }
    
    static delete(username) {
        let user = new Promise((resolve, reject) => {
            db.connection.query('DELETE FROM users WHERE username = ?', username, function(err, results) {
                if (err) reject(err);
                else resolve(results);
            });
        });
        return user;
    }

    static findAll() {
        let users = new Promise((resolve, reject) => {
            db.connection.query('SELECT id, first_name, last_name, username, image FROM users ORDER BY id DESC', function(err, results) {
                if (err) reject(err);
                else resolve(results);
            });
        });
        return users;
    }
    
    static findSubscriptionsById(sub_id) {
        let pubs = new Promise((resolve, reject) => {
            db.connection.query('SELECT id, first_name, last_name, username, image FROM subscriptions LEFT JOIN users ON publisher_id = users.id WHERE subscriber_id = ? ORDER BY id DESC', sub_id, function(err, results) {
                if (err) reject(err);
                else resolve(results);
            });
        });
        return pubs;
    }

    static findBySearch(string) {
        let result = new Promise((resolve, reject) => {
            db.connection.query('SELECT id, first_name, last_name, username, image, MATCH (first_name, last_name, username) AGAINST (?) as score FROM users WHERE MATCH (first_name, last_name, username) AGAINST (?) > 0 ORDER BY score DESC', [string, string], function(err, results) {
                if (err) reject(err);
                else resolve(results);
            });
        });
        return result;
    }
    
    static findByIdAndUpdate(id, image, username) {
        let updatedUser = new Promise((resolve, reject) => {
            db.connection.query('UPDATE users SET image = ?, username = ? WHERE id = ?', [image, username, id], function(err, results) {
                if (err) reject(err);
                else resolve(results);
            });
        });
        return updatedUser;
    }

    static findByIdAndUpdatePassword(password, id) {
        let updatedUser = new Promise((resolve, reject) => {
            db.connection.query('UPDATE users SET password = ? WHERE id = ?', [password, id], function(err, results) {
                if (err) reject(err);
                else resolve(results);
            });
        });
        return updatedUser;
    }

    static findFavorites(id) {
        let favorites = new Promise((resolve, reject) => {
            db.connection.query('SELECT reading_id, user_id FROM favorites WHERE user_id = ?', id, function(err, results) {
                if (err) reject(err);
                else resolve(results)
            });
        });
        return favorites;
    }
}

module.exports = User;