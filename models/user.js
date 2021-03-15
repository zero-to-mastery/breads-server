const   db = require('.'),
        queries = require('../queries/user');

exports.create = user => {
    const newUser = new Promise((resolve, reject) => {
        db.connection.query(queries.insertUser, [[user]], (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
    return newUser;
}

exports.findByUsername = username => {
    const user = new Promise((resolve, reject) => {
        db.connection.query(queries.selectByUsername, username, (err, results) => {
            if (err) reject(err);
            else resolve(results);  
        });
    });
    return user;
}
    
exports.findById = id => {
    const user = new Promise((resolve, reject) => {
        db.connection.query(queries.selectById, id, (err, results) => {
            if (err) reject(err);
            else resolve(results);  
        });
    });
    return user;
}

exports.findByEmail = email => {
    const user = new Promise((resolve, reject) => {
        db.connection.query(queries.selectByEmail, email, (err, results) => {
            if (err) reject(err);
            else resolve(results);  
        });
    });
    return user;
}
    
exports.delete = username => {
    const user = new Promise((resolve, reject) => {
        db.connection.query(queries.deleteUser, username, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
    return user;
}

exports.findAll = () => {
    const users = new Promise((resolve, reject) => {
        db.connection.query(queries.selectAllUsers, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
    return users;
}
    
exports.findSubscriptionsById = sub_id => {
    const subscriptions = new Promise((resolve, reject) => {
        db.connection.query(queries.selectUserSubscriptions, sub_id, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
    return subscriptions;
}

exports.findFollowersById = id => {
    const followers = new Promise((resolve, reject) => {
        db.connection.query(queries.selectUserSubscribers, id, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
    return followers;
}

exports.findBySearch = string => {
    const result = new Promise((resolve, reject) => {
        db.connection.query(queries.searchUsers, [string, string], (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
    return result;
}
    
exports.findByIdAndUpdate = (id, image, username) => {
    const updatedUser = new Promise((resolve, reject) => {
        db.connection.query(queries.updateUser, [image, username, id], (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
    return updatedUser;
}

exports.findByIdAndUpdatePassword = (password, id) => {
    const updatedUser = new Promise((resolve, reject) => {
        db.connection.query(queries.updateUserPassword, [password, id], (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
    return updatedUser;
}

exports.findFavorites = id => {
    const favorites = new Promise((resolve, reject) => {
        db.connection.query(queries.selectUserFavorites, id, (err, results) => {
            if (err) reject(err);
            else resolve(results)
        });
    });
    return favorites;
}