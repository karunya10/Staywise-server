const express = require("express");
const router = express.Router();

const User = require("../models/user.model");

router.get("/:userid", async (req, res, next) => {
  const { userid } = req.params;
  try {
    const user = await User.findById(userid);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

router.get("/:userid/favorites", async (req, res, next) => {
  const { userid } = req.params;
  try {
    const user = await User.findById(userid).populate("favorites");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user.favorites);
  } catch (error) {
    next(error);
  }
});

router.post("/:userid/favorites/:listingid", async (req, res, next) => {
  const { userid, listingid } = req.params;
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
});

router.delete("/:userid/favorites/:listingid", async (req, res, next) => {
  const { userid, listingid } = req.params;
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
});

router.delete("/:userid", async (req, res, next) => {
  const { userid } = req.params;
  try {
    const user = await User.findByIdAndDelete(userid);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.favorites = user.favorites.filter(
      (fav) => fav.toString() !== listingid
    );
    await user.save();
    res.status(200).json(user.favorites);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
