const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const dayjs = require("dayjs");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const userWithEmail = await User.findOne({ where: { email } }).catch(
    (err) => {
      console.log("Error: ", err);
    }
  );

  if (!userWithEmail)
    return res
      .status(400)
      .json({ message: "Email or password does not match!" });

  if (userWithEmail.password !== password)
    return res
      .status(400)
      .json({ message: "Email or password does not match!" });

  const jwtToken = jwt.sign(
    { id: userWithEmail.id, email: userWithEmail.email },
    process.env.JWT_SECRET
  );

  userWithEmail.password = undefined;

  res.cookie("api-auth", jwtToken, {
    secure: false,
    httpOnly: true,
    expires: dayjs().add(7, "days").toDate(),
  });

  res.json({ message: "Welcome Back!", user: userWithEmail });
});

module.exports = router;
