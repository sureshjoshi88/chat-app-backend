const express = require("express");
const { signup } = require("../controller/sign");
const router = express.Router();

router.post("/auth/signup", signup);

module.exports = router;