const express = require("express");
const User = require("../models/user");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body;

  console.log("Data: ", req.body);

  if (!fullName || !email || !password) {
    return res
      .status(400)
      .json({ message: "FullName, email and password is required!" });
  }

  const alreadyExistsUser = await User.findOne({ where: { email } }).catch(
    (err) => {
      console.log("Error: ", err);
    }
  );

  if (alreadyExistsUser) {
    return res.status(409).json({ message: "User with email already exists!" });
  }

  const newUser = new User({ fullName, email, password });
  const savedUser = await newUser.save().catch((err) => {
    console.log("Error: ", err);
    res.status(500).json({ error: "Cannot register user at the moment!" });
  });

  if (savedUser) res.json({ message: "Thanks for registering" });
});

module.exports = router;

/**
 
  [
  '{{repeat(1000)}}',
  {
    fullName: '{{firstName() + " " + surname()}}',
    email: '{{random("test123", "t123ffgd", "hola234", "john34fd2", "pass123456", "321pass345", "pa$$w0rd342", "name3435", "anonym443$f", "rocks434tar", "Svveet344", "123letitbe321", "candy34corn", "spaceX0X", "can434tessting", "1337xheaven", "animelover22", "anime0wow")}}',
    password: '{{guid()}}'
  }
]


 */
