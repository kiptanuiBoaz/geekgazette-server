const express = require("express");
const router = express.Router(); 
const {handleNewUser} = require("../controllers/auth/registerController");

router.post("/", handleNewUser);

module.exports = router;