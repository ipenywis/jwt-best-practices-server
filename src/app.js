const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();
require("./auth/passport");
require("./redis");

require("./models/user");

const middlewares = require("./middlewares");
const api = require("./api");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "*");
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");

//   next();
// });

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,UPDATE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  next();
});

// app.use(
//   cors({
//     allowedHeaders: "*",
//     allowMethods: "*",
//     allowOrigin: "*",
//     origin: "*",
//   })
// );
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "pages/homepage.html"));
});

require("./middlewares/auth")(app);
app.use("/api/v1", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
