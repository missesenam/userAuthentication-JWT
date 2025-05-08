const express = require("express");
const { body } = require("express-validator");
const userModel = require("../model/UserModel");
const { signUp, signIn } = require("../controllers/UserController");

const userRoute = express.Router();

const usernameIsUniq = async (value, { req }) => {
  const user = await userModel.findOne({ username: value });
  if (user) {
    return Promise.reject("Username already taken");
  }
};

userRoute.post(
  "/signup",
  [
    body("username")
      .not()
      .isEmpty()
      .withMessage("Username is required")
      .custom(usernameIsUniq),
    body("password").not().isEmpty().withMessage("Password is required"),
  ],
  signUp
);

userRoute.post(
  "/signin",
  [body("username").not().isEmpty(), body("password").not().isEmpty()],
  signIn
);

module.exports = userRoute;
