const passport = require("passport");
const passportJwt = require("passport-jwt");
const ExtractJwt = passportJwt.ExtractJwt;
const StrategyJwt = passportJwt.Strategy;
const User = require("../models/user");

const cookieExtractor = function (req) {
  let token = null;
  console.log(
    "Extracting: ",
    req.cookies["api-auth"],
    req.signedCookies["api-auth"]
  );
  if (req && req.cookies) token = req.cookies["api-auth"];
  // if (req && req.signedCookies && req.signedCookies.jwt) {
  //   token = req.signedCookies["jwt"]["token"];
  // }
  return token;
};

passport.use(
  new StrategyJwt(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.JWT_SECRET,
      maxAge: "7d",
    },
    function (jwtPayload, done) {
      return User.findOne({ where: { id: jwtPayload.id } })
        .then((user) => {
          return done(null, user);
        })
        .catch((err) => {
          return done(err);
        });
    }
  )
);
