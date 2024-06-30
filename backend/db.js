const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://shubham:arumvB2OlOtp6d12@cluster0.h1gsrn2.mongodb.net/"
);
//Schema for User
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowerCase: true,
    minLength: 3,
    maxLength: 30,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  firstName: {
    type: String,
    required: true,
    trin: true,
    maxLength: 50,
  },
  lastName: {
    type: String,
    required: true,
    trin: true,
    maxLength: 50,
  },
});
//Schema for Account
const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to User model
    required: true,
  },
  balance: {
    type: number,
    required: true,
  },
});
//Create a model from the Schema
const User = new mongoose.model("User", userSchema);
const Account = new mongoose.model("Account", accountSchema);

module.exports = {
  User,
  Account,
};
