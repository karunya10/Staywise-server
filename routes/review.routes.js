const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/auth.middleware");
const Booking = require("../models/booking.model");

const Review = require("../models/review.model");

router.post("/", isAuthenticated, async (req, res, next) => {
  const { review } = req.body;
  const { user } = req.payload;
  try {
    const booking = await Booking.findOne({
      $and: [{ _id: review.bookingId }, { guestId: user._id }],
    });
    if (!booking) {
      return res.status(404).json({ message: "Booking Not Found" });
    }
    const response = await Review.create({ review });
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

router.get("/:reviewid", async (req, res, next) => {
  const { reviewid } = req.params;
  try {
    const review = await Review.findById(reviewid);
    res.status(200).json(review);
  } catch (error) {
    next(error);
  }
});

router.put("/:reviewid", isAuthenticated, async (req, res, next) => {
  const { reviewid } = req.params;
  const { user } = req.payload;
  try {
    const review = await Review.findOneAndUpdate(
      { _id: reviewid, authorId: user._id },
      req.body,
      { new: true }
    );
    if (!review) {
      return res
        .status(404)
        .json({ message: "Review not found or not authorized" });
    }
    res.status(200).json(review);
  } catch (error) {
    next(error);
  }
});

router.delete("/:reviewid", isAuthenticated, async (req, res, next) => {
  const { reviewid } = req.params;
  const { user } = req.payload;
  try {
    const review = await Review.findOneAndDelete({
      _id: reviewid,
      authorId: user._id,
    });
    if (!review) {
      return res
        .status(404)
        .json({ message: "Review not found or not authorized" });
    }
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

router.get("/listings/:listingId/reviews", async (req, res, next) => {
  const { listingId } = req.params;
  try {
    const reviews = await Review.find({ listingId: listingId });
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
