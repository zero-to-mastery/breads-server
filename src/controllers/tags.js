let Tags = require("../models/tags");

exports.createTags = async (req, res, next) => {
  try {
    const newTag = await Tags.create(
      req.body.tags,
      req.body.reading_id,
      req.params.id
    );
    return res.status(200).json(newTag);
  } catch (err) {
    console.log("createTag - controllers/tags");
    console.log(err);
    return next(err);
  }
};

exports.findAllTags = async (req, res, next) => {
  try {
    let allTags = await Tags.findAll();
    let tags = allTags.map((tag) => {
      return (tag = {
        id: tag.id,
        tag_name: tag.tag_name,
        reading_id: tag.reading_id.split(","),
        // 'user_id': tag.user_id.split(','),
        date: tag.date,
        count: tag.count,
      });
    });
    return res.status(200).json(tags);
  } catch (err) {
    console.log("findTagsByReadingId - controllers/tags");
    console.log(err);
    return next(err);
  }
};

exports.findUserTags = async (req, res, next) => {
  try {
    let userTags = await Tags.findUserTags(req.params.id);
    let tags = userTags.map((tag) => {
      return (tag = {
        id: tag.id,
        tag_name: tag.tag_name,
        user_id: tag.user_id.split(","),
        date: tag.date,
        count: tag.count,
      });
    });
    return res.status(200).json(tags);
  } catch (err) {
    console.log("findUserTags - controllers/tags");
    console.log(err);
    return next(err);
  }
};

exports.findSubscriptionTags = async (req, res, next) => {
  try {
    let userTags = await Tags.findSubscriptionTags(req.params.id);
    let tags = userTags.map((tag) => {
      return (tag = {
        id: tag.id,
        tag_name: tag.tag_name,
        // 'reading_id': tag.reading_id.split(','),
        user_id: tag.user_id.split(","),
        date: tag.date,
        count: tag.count,
      });
    });
    return res.status(200).json(tags);
  } catch (err) {
    console.log("findTagsByReadingId - controllers/tags");
    console.log(err);
    return next(err);
  }
};

exports.updateTags = async (req, res, next) => {
  try {
    // add new tags to tags and reading_tags table
    if (req.body.add_tags) {
      await Tags.create(req.body.add_tags, req.body.reading_id, req.params.id);
    }

    // remove old tags from reading_tags table (keep in tags table)
    if (req.body.delete_tags) {
      await Tags.deleteFromReading(
        req.body.reading_id,
        req.body.delete_tags,
        req.params.id
      );
    }

    return res.status(200).json("Update successful");
  } catch (err) {
    console.log("updateTags - controllers/tags");
    console.log(err);
    return next(err);
  }
};

exports.findReadingTags = async (req, res, next) => {
  try {
    let tags = await Tags.findTagsByReadingId(req.params.id);
    return res.status(200).json(tags);
  } catch (err) {
    console.log("findTagsByReadingId - controllers/tags");
    console.log(err);
    return next(err);
  }
};
