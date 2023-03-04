const express = require("express");
const router = express.Router();
const {updateLikes} = require("../../controllers/posts/likesController");

router.route("/").put(updateLikes)

module.exports = router;