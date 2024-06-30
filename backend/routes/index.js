// backend/api/index.js
const express = require("express");
const userRouter = require("./user");
const accountRouter = require("./account");
const router = express.Router();
const app = express();

app.use("/user", userRouter);
app.use("/account", accountRouter);

module.exports = router;
