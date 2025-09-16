const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const validator = require("validator");
const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const isAuthenticated = require("../middleware/auth.middleware");

router.post("/signup", async (req, res, next) => {
  const { email, password, name } = req.body;
  if (!email || (email && !validator.isEmail(email))) {
    res.status(403).json({ error: "Email is not valid" });
    throw new Error("Email is not valid");
  }
  if (
    !password ||
    (password &&
      !validator.isStrongPassword(password, {
        minLength: 8,
        minUppercase: 1,
      }))
  ) {
    res.status(403).json({ error: "Password is not valid" });
    throw new Error("Password is not valid");
  }
  if (!name || (name && validator.isEmpty(name))) {
    res.status(403).json({ error: "username is not valid" });
    throw new Error("Username is not valid");
  }
  try {
    const generatedSalt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, generatedSalt);
    await UserModel.create({ email, password: hashedPassword, name: name });
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || (email && !validator.isEmail(email))) {
    res.status(403).json({ error: "Wrong credentials" });
    throw new Error("Email is not valid");
  }
  if (
    !password ||
    (password &&
      !validator.isStrongPassword(password, {
        minLength: 8,
        minUppercase: 1,
      }))
  ) {
    res.status(403).json({ error: "Wrong credentials" });
    throw new Error("Password is not valid");
  }
  try {
    const foundUser = await UserModel.findOne({ email });
    if (!foundUser) {
      throw new Error("Signup First");
    }
    const passwordPassed = await bcrypt.compare(password, foundUser.password);
    if (!passwordPassed) {
      throw new Error("Wrong credentials");
    }
    const userObj = foundUser.toObject();
    delete userObj.password;
    const token = jwt.sign({ user: foundUser }, process.env.TOKEN_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user: userObj });
  } catch (error) {
    next(error);
  }
});

router.get("/verify", isAuthenticated, (req, res) => {
  const user = req.payload.user;
  delete user.password;
  res.json({ message: "Welcome to protected Route", user });
});

module.exports = router;
