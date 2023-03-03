const express = require("express");
const router = express.Router();
const { updateReactions } = require("../../controllers/reactionsController");

router.route("/")
    .put(updateReactions)

module.exports = router;