let express = require("express"),
  router = express.Router(),
  auth = require("../controllers/auth"),
  { handleFormData } = require("../middleware/auth");
// { cloudinaryConfig } = require('../middleware/auth');

// router.post('/signup', upload.single('image'), cloudinaryConfig, auth.signup);
router.post("/signup", handleFormData.single("image"), auth.signup);
router.post("/signin", auth.signin);
router.post("/reset", auth.sendPasswordResetEmail);
router.post("/:username/reset/:token", auth.updatePassword);
module.exports = router;
