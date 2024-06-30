// backend/api/index.js
const express = require("express");
const userRouter = require("./user");
const router = express.Router();
const app = express();

app.use("/user", userRouter);

module.exports = router;
