const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get(
  "/checkAuth",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = req.user;
    user.password = undefined;
    res.json({ message: "You're Logged in!", user });
  }
);

module.exports = router;
