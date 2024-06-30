// backend/routes/user.js
const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { User } = require("../db");
const { Mongoose } = require("mongoose");
const { JWT_SECRET } = require("../config");

const router = express.Router();

const userSignup = zod.object({
  username: zod.string().email(),
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
});

router.post("./signup", async (req, res) => {
  const userDataValidate = userSignup.safeParse(req.body);

  if (!userDataValidate.success) {
    res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }

  const existingUser = await User.findOne({
    Username: req.body.username,
  });

  if (existingUser) {
    res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }
  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });
  const userId = user._id;

  const jwt_token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );

  res.status(200).json({
    message: "User Created Successfully",
    jwt: jwt_token,
  });
});

module.exports = router;
