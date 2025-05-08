const userModel = require("../model/UserModel");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      console.log(error);
      return res
        .status(400)
        .json({ message: "validation failed", Error: error.array() });
    }
    // create user
    const { username, password } = req.body;
    // hashed pass
    const hashedpassword = await bcrypt.hash(password, 10);
    // new user format
    const newUser = await userModel.create({
      username,
      password: hashedpassword,
    });
    res.status(201).json({
      message: "user has been successfully created",
      user: { username: newUser.username },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
};
//
// login
//
const signIn = async (req, res) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      console.log(error);
      return res
        .status(400)
        .json({ message: "validation failed", Error: error.array() });
    }

    const { username, password } = req.body;
    //  find user
    const foundUser = await userModel.findOne({ username });
    if (!foundUser) {
      return res.status(401).json({ message: "User not found" });
    }
    // compare
    const isMatch = await bcrypt.compare(password, foundUser.password);

    if (!isMatch) {
      return res.status(401).json({ message: "password incorrect" });
    }
    // token
    const token = jwt.sign(
      { username: foundUser.username, foundUserId: foundUser._id },
      "secrettokenwaytolongforanybodytoguessshaaa",
      { expiresIn: "1h" }
    );
    res.status(200).json({ message: "user log in succesfully", token });
  } catch (err) {
    res.status(500).json({ message: "error signing in", error: err.message });
  }
};

module.exports = { signUp, signIn };
