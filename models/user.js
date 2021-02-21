let db = require('.'),
    bcrypt = require('bcrypt'),
    queries = require('../queries/user');

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
            db.connection.query(queries.insertUser, user, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        return newUser;
    }

    static findByUsername(username) {
        let user = new Promise((resolve, reject) => {
            db.connection.query(queries.selectByUsername, username, (err, results) => {
                if (err) reject(err);
                else resolve(results);  
            });
        });
        return user;
    }
    
    static findById(id) {
        let user = new Promise((resolve, reject) => {
            db.connection.query(queries.selectById, id, (err, results) => {
                if (err) reject(err);
                else resolve(results);  
            });
        });
        return user;
    }

    static findByEmail(email) {
        let user = new Promise((resolve, reject) => {
            db.connection.query(queries.selectByEmail, email, (err, results) => {
                if (err) reject(err);
                else resolve(results);  
            });
        });
        return user;
    }
    
    static delete(username) {
        let user = new Promise((resolve, reject) => {
            db.connection.query(queries.deleteUser, username, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        return user;
    }

    static findAll() {
        let users = new Promise((resolve, reject) => {
            db.connection.query(queries.selectAllUsers, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        return users;
    }
    
    static findSubscriptionsById(sub_id) {
        let following = new Promise((resolve, reject) => {
            db.connection.query(queries.selectUserSubscriptions, sub_id, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        return following;
    }

    static findFollowersById(id) {
        let followers = new Promise((resolve, reject) => {
            db.connection.query(queries.selectUserSubscribers, id, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        return followers;
    }

    static findBySearch(string) {
        let result = new Promise((resolve, reject) => {
            db.connection.query(queries.searchUsers, [string, string], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        return result;
    }
    
    static findByIdAndUpdate(id, image, username) {
        let updatedUser = new Promise((resolve, reject) => {
            db.connection.query(queries.updateUser, [image, username, id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        return updatedUser;
    }

    static findByIdAndUpdatePassword(password, id) {
        let updatedUser = new Promise((resolve, reject) => {
            db.connection.query(queries.updateUserPassword, [password, id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        return updatedUser;
    }

    static findFavorites(id) {
        let favorites = new Promise((resolve, reject) => {
            db.connection.query(queries.selectUserFavorites, id, (err, results) => {
                if (err) reject(err);
                else resolve(results)
            });
        });
        return favorites;
    }
}

module.exports = User;