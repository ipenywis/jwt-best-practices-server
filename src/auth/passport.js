const passport = require("passport");
const passportJwt = require("passport-jwt");
const ExtractJwt = passportJwt.ExtractJwt;
const StrategyJwt = passportJwt.Strategy;
const User = require("../models/user");
const client = require("../redis");

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
      passReqToCallback: true,
    },
    async function (req, jwtPayload, done) {
      const token = req.cookies["api-auth"];
      return User.findOne({ where: { id: jwtPayload.id } })
        .then(async (user) => {
          const redisUser = await client.get(String(user.id));
          let parsedUserData = JSON.parse(redisUser);
          parsedUserData = parsedUserData[String(user.id)];
          if (parsedUserData && parsedUserData.includes(token)) {
            return done({ message: "Invalid Token!" }, false);
          } else {
            return done(null, user);
          }
        })
        .catch((err) => {
          return done(err);
        });
    }
  )
);
