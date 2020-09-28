let db = require('.'),
    Reading = require('./reading');

class Tags {
    constructor(url, tags, user_id) {
        this.url = url
        this.tags = tags
        this.user_id = user_id
    }

    static create(tags) {
        let tagsArray = tags.split('#').filter(tag => tag !== '').map(tag => [tag.trim()]);

        let createdTags = new Promise(function (resolve, reject) {
            db.connection.query('INSERT INTO tags (tag_name) VALUES ? ON DUPLICATE KEY UPDATE count = count + 1', [tagsArray], function (err, results) {
                if (err) reject(err);
                else resolve(results);
            });
        });
        return createdTags;
    }

    static async addToReading(url, tags, user_id) {
        let tagsArray = tags.split('#').filter(tag => tag !== '').map(tag => [tag.trim()]);
        let readingId = await Reading.findIdByUrl(url);
        let tagId;
        let readingTags = await Promise.all(tagsArray.map(async tag => {
            tagId = await this.findIdByTagName(tag);
            return [readingId[0].id, tagId[0].id, parseInt(user_id)];
        }));

        let createdTags = new Promise(function (resolve, reject) {
            db.connection.query('INSERT INTO reading_tags (reading_id, tag_id, user_id) VALUES ?', [readingTags], function (err, results) {
                if (err) reject(err);
                else resolve(results);
            });
        });
        return createdTags;
    }

    static findIdByTagName(tag) {
        let id = new Promise((resolve, reject) => {
            db.connection.query('SELECT id FROM tags WHERE tag_name = ?', tag, function(err, results) {
                if (err) reject(err);
                else resolve(results);
            });
        });
        return id;
    }

    static findAll() {
        let tags = new Promise((resolve, reject) => {
            db.connection.query('SELECT id, tag_name, GROUP_CONCAT(reading_tags.reading_id) as reading_id, GROUP_CONCAT(reading_tags.user_id) as user_id, created_at as date, count FROM reading_tags LEFT JOIN tags ON tags.id = reading_tags.tag_id GROUP BY id, tag_name, created_at, count ORDER BY created_at DESC', function(err, results) {
                if (err) reject(err);
                else resolve(results);
            });
        });
        return tags;
    }

    static findUserTags(user_id) {
        let tags = new Promise((resolve, reject) => {
            db.connection.query('SELECT id, tag_name, GROUP_CONCAT(reading_tags.reading_id) as reading_id, GROUP_CONCAT(reading_tags.user_id) as user_id, created_at as date, count FROM reading_tags LEFT JOIN tags ON tags.id = reading_tags.tag_id WHERE reading_tags.user_id = ? GROUP BY id, tag_name, created_at, count ORDER BY created_at DESC', user_id, function(err, results) {
                if (err) reject(err);
                else resolve(results);
            });
        });
        return tags;
    }

    static findSubscriptionTags(user_id) {
        let tags = new Promise((resolve, reject) => {
            db.connection.query('SELECT id, tag_name, GROUP_CONCAT(reading_tags.reading_id) as reading_id, GROUP_CONCAT(reading_tags.user_id) as user_id, tags.created_at as date, count FROM reading_tags LEFT JOIN tags ON tags.id = reading_tags.tag_id LEFT JOIN subscriptions ON reading_tags.user_id = publisher_id WHERE subscriptions.subscriber_id = ? GROUP BY id, tag_name, tags.created_at, count ORDER BY tags.created_at DESC', user_id, function(err, results) {
                if (err) reject(err);
                else resolve(results);
            });
        });
        return tags;
    }

    static delete(reading_id) {
        let query = new Promise((resolve, reject) => {
            db.connection.query('DELETE FROM reading_tags WHERE reading_id = ?', reading_id, function(err, results) {
                if (err) reject(err);
                else resolve(results);
            });
        });
        return query;
    }

    static async deleteFromReading(url, tags, user_id) {
        let tagsArray = tags.split('#').filter(tag => tag !== '').map(tag => [tag.trim()]);
        let readingId = await Reading.findIdByUrl(url);
        let tagId;
        let readingTags = await Promise.all(tagsArray.map(async tag => {
            tagId = await this.findIdByTagName(tag);
            return [readingId[0].id, tagId[0].id, parseInt(user_id)];
        }));
        let query = new Promise((resolve, reject) => {
            db.connection.query('DELETE FROM reading_tags WHERE (reading_id, tag_id, user_id) IN ?', [[readingTags]], function(err, results) {
                if (err) reject(err);
                else resolve(results);
            })
        })
        return query;
    }
}

module.exports = Tags;