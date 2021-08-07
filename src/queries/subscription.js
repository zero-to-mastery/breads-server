exports.insertSubscription = `INSERT INTO subscriptions SET ?`;
exports.selectSubscriptionById = `SELECT * FROM subscriptions WHERE subscriber_id = ?`;
exports.deleteSubscription = `DELETE FROM subscriptions WHERE subscriber_id = ? AND publisher_id = ?`;
