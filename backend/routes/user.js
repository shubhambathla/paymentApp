// backend/routes/user.js
const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { User, Account } = require("../db");
const { Mongoose } = require("mongoose");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");

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

  //Assign random balance on signup
  await Account.create({
    userId,
    balance: 1 + Math.random() * 1000,
  });

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

const signinBody = zod.object({
  username: zod.string().email,
  passowrd: zod.string(),
});
router.post("./signin", async (req, res) => {
  const { success } = signinBody.safeParse(req.body);
  if (!success) {
    res.status(411).json({
      message: "Error while logging in",
    });
  }
  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (user) {
    const jwt_token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET
    );
    res.status(200).json({
      token: jwt_token,
    });
    return;
  }

  res.status(411).json({
    message: "Error while logging in",
  });
});

const userUpdate = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});
router.put("/", authMiddleware, async (req, res) => {
  const userUpdateVerify = userUpdate.safeParse(req.body);
  if (!userUpdateVerify.success) {
    res.status(411).json({
      message: "Error while updating information",
    });
  }
  await User.updateOne(req.body, {
    _id: req.userId,
  });

  res.status(200).json({
    message: "Updated successfully",
  });
});

const userQueryName = zod.object({
  firstName: zod.String,
  lastName: zod.String,
});

router.get("/filter-user", async (req, res) => {
  const filterName = req.params.filter || "";
  const user = await User.find({
    $or: [
      {
        firstName: { $regex: filterName },
      },
      {
        lastName: { $regex: filterName },
      },
    ],
  });
  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

module.exports = router;
