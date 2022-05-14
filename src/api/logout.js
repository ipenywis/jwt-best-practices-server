const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const dayjs = require("dayjs");
const passport = require("passport");
const client = require("../redis");

const router = express.Router();

router.post(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id } = req.user;
      const authToken = req.cookies["api-auth"];

      const redisUserRecord = await client.get(String(id));
      console.log("Record: ", redisUserRecord);
      if (redisUserRecord) {
        const parsedData = JSON.parse(redisUserRecord);
        parsedData[String(id)].push(authToken);
        client.setEx(String(id), 7 * 24 * 60 * 60, JSON.stringify(parsedData));
        console.log("Data: ", parsedData);

        res.clearCookie("api-auth");
        res.json({ message: "Good Bye!" });
      } else {
        const blacklistedData = {
          [String(id)]: [authToken],
        };

        client.setEx(
          String(id),
          7 * 24 * 60 * 60,
          JSON.stringify(blacklistedData)
        );

        res.clearCookie("api-auth");
        res.json({ message: "Good Bye!" });
      }
    } catch (err) {
      console.log("Error: ", err);
      res.status(500).json({ message: "Internal Server Error!" });
    }
  }
);

module.exports = router;
