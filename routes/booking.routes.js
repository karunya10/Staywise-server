const express = require("express");
const router = express.Router();

const Booking = require("../models/booking.model");
const Listing = require("../models/listing.model");
const isAuthenticated = require("../middleware/auth.middleware");

router.get("/", isAuthenticated, async (req, res, next) => {
  const user = req.payload.user;
  try {
    const bookings = await Booking.find({ guestId: user._id });
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
});

router.get("/host", isAuthenticated, async (req, res, next) => {
  const user = req.payload.user;
  try {
    const listings = await Listing.find({ hostId: user._id });
    const listingIds = listings.map((listing) => listing._id);
    const bookings = await Booking.find({ listingId: { $in: listingIds } });
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
});

router.post("/", isAuthenticated, async (req, res, next) => {
  const { newBooking } = req.body;
  try {
    const booking = Booking.create({ newBooking });
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
});

router.get("/:bookingid", isAuthenticated, async (req, res, next) => {
  const { bookingid } = req.params;
  const { user } = req.payload;
  try {
    const booking = await Booking.findById(bookingid);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.guestId.toString() !== user._id) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this booking" });
    }
    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
});

router.put("/:bookingid/cancel", async (req, res, next) => {
  const { bookingid } = req.params;
  try {
    const booking = await Booking.findById(bookingid);
    booking.status = "cancelled";
    await booking.save();
    res.status(204).json(booking);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
