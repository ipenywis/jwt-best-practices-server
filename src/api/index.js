const express = require("express");
const registerApi = require("./register");
const loginApi = require("./login");
const paymentApi = require("./payment");
const isAuthenticated = require("./isAuthenticated");
const stealToken = require("./stealToken");
const logout = require("./logout");

const router = express.Router();

router.use(registerApi);
router.use(loginApi);
router.use(paymentApi);
router.use(isAuthenticated);
router.use(stealToken);
router.use(logout);

module.exports = router;
