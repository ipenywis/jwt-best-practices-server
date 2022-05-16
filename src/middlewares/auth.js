module.exports = (app) => {
  const passport = require("passport");
  const express = require("express");
  const client = require("../redis");

  app.use((req, res, next) => {
    try {
      passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (!user) {
          return next(null);
        }
        const token = req.cookies["api-auth"];
        console.log("Auth Middleware", user);
        client.get(String(user.id)).then((redisUser) => {
          let parsedUserData = JSON.parse(redisUser);
          parsedUserData = parsedUserData[String(user.id)];

          if (parsedUserData && parsedUserData.includes(token)) {
            res.clearCookie("api-auth");
            return res.status(401).json({ message: "Invalid Token!" });
          } else {
            return next();
          }
        });
      })(req, res, next);
    } catch (err) {
      console.log("Error: ", err);
      next(err);
    }
  });
};
