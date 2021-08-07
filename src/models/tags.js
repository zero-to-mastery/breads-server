let db = require("."),
  Reading = require("./reading"),
  queries = require("../queries/tag");

class Tags {
  constructor(url, tags, user_id) {
    this.url = url;
    this.tags = tags;
    this.user_id = user_id;
  }

  static async create(tags, reading_id, user_id) {
    const tagsArray = tags
      .split("#")
      .filter((tag) => tag !== "")
      .map((tag) => [tag.trim()]);
    const createdTags = await new Promise(function (resolve, reject) {
      db.connection.query(queries.insertTags, [tagsArray], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    // const readingId = await Reading.findIdByUrl(url);
    const tagIds = await Promise.all(
      tagsArray.map(async (tag) => await this.findIdByTagName(tag))
    );

    const readingTags = tagIds.map((tag_id) => [reading_id, tag_id[0].id]);
    const insertReadingTags = await new Promise((resolve, reject) => {
      db.connection.query(
        queries.insertReadingTags,
        [readingTags],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });

    const userTags = tagIds.map((tag_id) => [parseInt(user_id), tag_id[0].id]);
    const insertUserTags = await new Promise((resolve, reject) => {
      db.connection.query(
        queries.insertUserTags,
        [userTags],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });

    return [createdTags, insertReadingTags, insertUserTags];
  }

  static findIdByTagName(tag) {
    let id = new Promise((resolve, reject) => {
      db.connection.query(queries.selectIdByTagName, tag, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    return id;
  }

  static findAll() {
    let tags = new Promise((resolve, reject) => {
      db.connection.query(queries.selectAllTags, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    return tags;
  }

  static findUserTags(user_id) {
    let tags = new Promise((resolve, reject) => {
      db.connection.query(queries.selectUserTags, user_id, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    return tags;
  }

  static findSubscriptionTags(user_id) {
    let tags = new Promise((resolve, reject) => {
      db.connection.query(
        queries.selectSubscriptionTags,
        user_id,
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
    return tags;
  }

  static deleteWithId(reading_id) {
    const deletedTags = new Promise((resolve, reject) => {
      db.connection.query(queries.deleteTags, reading_id, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    return deletedTags;
  }

  static async deleteFromReading(reading_id, tags, user_id) {
    const tagsArray = tags
      .split("#")
      .filter((tag) => tag !== "")
      .map((tag) => [tag.trim()]);
    const tagIds = await Promise.all(
      tagsArray.map(async (tag) => await this.findIdByTagName(tag))
    );

    const readingTags = tagIds.map((tag_id) => [reading_id, tag_id[0].id]);
    const deletedReadingTags = new Promise((resolve, reject) => {
      db.connection.query(
        queries.deleteReadingTags,
        [[readingTags]],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });

    const userTags = tagIds.map((tag_id) => [parseInt(user_id), tag_id[0].id]);
    const deletedUserTags = new Promise((resolve, reject) => {
      db.connection.query(
        queries.deleteUserTags,
        [[userTags]],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });

    return [deletedReadingTags, deletedUserTags];
  }
}

module.exports = Tags;
