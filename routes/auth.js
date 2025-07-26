const express = require("express");

const { login, register } = require("../controllers/auth");

const router = express.Router();

router.route("/auth/login").post(login);

router.route("/auth/register").post(register);

module.exports = router;
