exports.insertUser = `INSERT INTO users (first_name, last_name, username, email, password, image) VALUES ?`;
exports.selectByUsername = `SELECT * FROM users WHERE username = ?`;
exports.selectById = `SELECT id, username, image FROM users WHERE id = ?`;
exports.selectByEmail = `SELECT * FROM users WHERE email = ?`;
exports.deleteUser = `DELETE FROM users WHERE username = ?`;
exports.selectAllUsers = `SELECT id, first_name, last_name, username, image FROM users ORDER BY id DESC`;
exports.updateUser = `UPDATE users SET image = ?, username = ? WHERE id = ?`;
exports.updateUserPassword = `UPDATE users SET password = ? WHERE id = ?`;
exports.selectUserFavorites = `SELECT reading_id, user_id FROM favorites WHERE user_id = ?`;

exports.selectUserSubscriptions = `
    SELECT
        id,
        username,
        image
    FROM subscriptions
    LEFT JOIN users ON publisher_id = users.id
    WHERE subscriber_id = ?
    ORDER BY id DESC`;

exports.selectUserSubscribers = `
    SELECT
        id,
        username,
        image
    FROM subscriptions
    LEFT JOIN users ON subscriber_id = users.id
    WHERE publisher_id = ?
    ORDER BY id DESC`;

exports.searchUsers = `
    SELECT
        id,
        first_name,
        last_name,
        username,
        image,
    MATCH
        (first_name, last_name, username)
    AGAINST (?) as score
    FROM users
    WHERE MATCH
        (first_name, last_name, username)
    AGAINST (?) > 0
    ORDER BY score DESC`;
