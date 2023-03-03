const express = require("express");
const router = express.Router();
const {updateLikes} = require("../../controllers/likesController");

router.route("/").put(updateLikes)

module.exports = router;