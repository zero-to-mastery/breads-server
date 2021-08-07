let db = require("."),
  queries = require("../queries/subscription");

class Subscription {
  constructor(subscriber_id, publisher_id) {
    (this.subscriber_id = subscriber_id), (this.publisher_id = publisher_id);
  }

  static create(user_id, sub_id) {
    let subscription = new Promise((resolve, reject) => {
      db.connection.query(
        queries.insertSubscription,
        [user_id, sub_id],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
    return subscription;
  }

  static findBySubId(sub_id) {
    let subscription = new Promise((resolve, reject) => {
      db.connection.query(
        queries.selectSubscriptionById,
        sub_id,
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
    return subscription;
  }

  static delete(user_id, sub_id) {
    let subscription = new Promise((resolve, reject) => {
      db.connection.query(
        queries.deleteSubscription,
        [user_id, sub_id],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
    return subscription;
  }
}

module.exports = Subscription;
