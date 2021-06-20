const express = require("express");
const registerApi = require("./register");
const loginApi = require("./login");
const paymentApi = require("./payment");
const fibonacciApi = require("./fibonacci");

const router = express.Router();

router.use(registerApi);
router.use(loginApi);
router.use(fibonacciApi);
router.use(paymentApi);

module.exports = router;
