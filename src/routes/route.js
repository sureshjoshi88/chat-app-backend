const express = require("express");
const { signup } = require("../controller/sign");
const { login, getAllUser } = require("../controller/login");
const router = express.Router();

router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.get("/user", getAllUser);

module.exports = router;