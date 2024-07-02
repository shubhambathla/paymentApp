const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { User, Account } = require("../db");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");

const router = express.Router();

const signupBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
});
const userSignIn = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

router.post("/signup", async (req, res) => {
  const userDataValidate = signupBody.safeParse(req.body);
  if (!userDataValidate.success) {
    res.status(411).json({
      message: "Incorrect inputs",
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

router.post("/signin", async (req, res) => {
  const { success } = userSignIn.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
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

const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});
router.put("/", authMiddleware, async (req, res) => {
  const userUpdateVerify = updateBody.safeParse(req.body);
  if (!userUpdateVerify.success) {
    res.status(411).json({
      message: "Error while updating information",
    });
  }
  //   await User.updateOne(req.body, {
  //     _id: req.userId,
  //   });

  //   res.status(200).json({
  //     message: "Updated successfully",
  //   });

  try {
    await User.updateOne(
      { _id: req.userId }, // Filter criteria
      req.body // Update operations
    );

    res.status(200).json({
      message: "Updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

router.get("/filter-user", async (req, res) => {
  const filterName = req.params.filter || "";
  const users = await User.find({
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
