let express = require("express"),
  router = express.Router({ mergeParams: true }),
  search = require("../controllers/search");

router.get("/", search.searchAll);
router.get("/users", search.searchUsers);

module.exports = router;
