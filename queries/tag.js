exports.insertTags = `INSERT INTO tags (tag_name) VALUES ? ON DUPLICATE KEY UPDATE count = count + 1`;
exports.insertReadingTags = `INSERT INTO reading_tags (reading_id, tag_id) VALUES ?`;
exports.insertUserTags = `INSERT INTO user_tags (user_id, tag_id) VALUES ?`;
exports.selectIdByTagName = `SELECT id FROM tags WHERE tag_name = ?`;
exports.deleteTags = `DELETE FROM reading_tags WHERE reading_id = ?`;
exports.deleteUserTags = `DELETE FROM user_tags WHERE (user_id, tag_id) IN ?`;
exports.deleteReadingTags = `DELETE FROM reading_tags WHERE (reading_id, tag_id) IN ?`;

exports.selectAllTags = `
    SELECT
        tags.id,
        tag_name,
        GROUP_CONCAT(reading_tags.reading_id) as reading_id,
        created_at as date,
        count
    FROM reading_tags
    LEFT JOIN tags ON tags.id = reading_tags.tag_id
    GROUP BY
        tags.id,
        tag_name,
        created_at,
        count
    ORDER BY created_at DESC`;

exports.selectUserTags = `
    SELECT
        tags.id,
        tag_name,
        GROUP_CONCAT(user_tags.user_id) as user_id,
        created_at as date,
        count
    FROM user_tags
    LEFT JOIN tags ON tags.id = user_tags.tag_id
    WHERE user_tags.user_id = ?
    GROUP BY
        tags.id,
        tag_name,
        created_at,
        count
    ORDER BY created_at DESC`;

exports.selectSubscriptionTags = `
    SELECT
        tags.id,
        tag_name,
        GROUP_CONCAT(user_tags.user_id) as user_id,
        tags.created_at as date,
        count
    FROM subscriptions
    LEFT JOIN user_tags ON user_tags.user_id = publisher_id
    LEFT JOIN tags ON tags.id = user_tags.tag_id
    WHERE subscriber_id = ?
    GROUP BY
        tags.id,
        tag_name,
        tags.created_at,
        count
    ORDER BY tags.created_at DESC`;