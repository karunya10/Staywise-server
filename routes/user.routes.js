const express = require("express");
const router = express.Router();
const {
  updateUserValidation,
  favoritesValidation,
} = require("../validators/user.validator");
const {
  handleValidationErrors,
} = require("../middleware/validation.middleware");

const User = require("../models/user.model");
const isAuthenticated = require("../middleware/auth.middleware");

router.get("/", isAuthenticated, async (req, res, next) => {
  const userid = req.payload.user._id;
  try {
    const user = await User.findById(userid);
    if (!user) return res.status(404).json({ message: "User not found" });
    const truncatedUser = user.toObject();
    delete truncatedUser.password;
    res.status(200).json(truncatedUser);
  } catch (error) {
    next(error);
  }
});

router.get("/favorites", isAuthenticated, async (req, res, next) => {
  const userid = req.payload.user._id;
  try {
    const user = await User.findById(userid);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user.favorites);
  } catch (error) {
    next(error);
  }
});

router.put(
  "/",
  isAuthenticated,
  updateUserValidation,
  handleValidationErrors,
  async (req, res, next) => {
    const userid = req.payload.user._id;
    try {
      const user = await User.findByIdAndUpdate(userid, req.body, {
        new: true,
      });
      if (!user) return res.status(404).json({ message: "User not found" });
      const truncatedUser = user.toObject();
      delete truncatedUser.password;
      res.status(200).json(truncatedUser);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/favorites/:listingid",
  isAuthenticated,
  favoritesValidation,
  handleValidationErrors,
  async (req, res, next) => {
    const { listingid } = req.params;
    const userid = req.payload.user._id;
    try {
      const user = await User.findById(userid);
      if (!user) return res.status(404).json({ message: "User not found" });
      if (!user.favorites.includes(listingid)) {
        user.favorites.push(listingid);
        await user.save();
      }
      res.status(200).json(user.favorites);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/favorites/:listingid",
  isAuthenticated,
  favoritesValidation,
  handleValidationErrors,
  async (req, res, next) => {
    const { listingid } = req.params;
    const userid = req.payload.user._id;
    try {
      const user = await User.findById(userid);
      if (!user) return res.status(404).json({ message: "User not found" });
      user.favorites = user.favorites.filter(
        (fav) => fav.toString() !== listingid
      );
      await user.save();
      res.status(200).json(user.favorites);
    } catch (error) {
      next(error);
    }
  }
);

//unused
// Delete user and cascade delete listings, bookings, and reviews
const { cascadeDeleteUserData } = require("../utils/cascadeDelete");

router.delete("/", isAuthenticated, async (req, res, next) => {
  const userid = req.payload.user._id;
  try {
    await cascadeDeleteUserData(userid);
    const user = await User.findByIdAndDelete(userid);
    if (!user) return res.status(404).json({ message: "User not found" });
    res
      .status(200)
      .json({ message: "User and related data deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
