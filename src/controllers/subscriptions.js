let Subscription = require("../models/subscription");

exports.createSubscription = async (req, res, next) => {
  try {
    if (req.params.id !== req.body.sub_id) {
      let newSubscription = new Subscription(req.params.id, req.body.sub_id);
      let subscription = await Subscription.create(newSubscription);
      return res.status(200).json(subscription);
    }
  } catch (err) {
    console.log("createSubscription - controllers/subscriptions");
    if (err.code === "ER_DUP_ENTRY") {
      err.message = "You already subscribe to them!";
    }
    return next({
      status: 400,
      message: err.message,
    });
  }
};

exports.deleteSubscription = async (req, res, next) => {
  try {
    let deletedSubscription = await Subscription.delete(
      Number(req.params.user_id),
      Number(req.params.sub_id)
    );
    return res.status(200).json(deletedSubscription);
  } catch (err) {
    console.log("deleteSubscription - controllers/subscriptions");
    return next(err);
  }
};
