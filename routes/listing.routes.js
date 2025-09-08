const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.model");
const Booking = require("../models/booking.model");

const isAuthenticated = require("../middleware/auth.middleware");

router.get("/", async (req, res, next) => {
  try {
    const response = await Listing.find();
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

router.get("/:listingid", async (req, res, next) => {
  const { listingid } = req.params;
  try {
    const response = await Listing.findById(listingid);
    if (!response)
      return res.status(404).json({ message: "Listing not found" });
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

router.post("/", isAuthenticated, async (req, res, next) => {
  const { listing } = req.body;
  try {
    const response = await Listing.create({ listing });
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

router.put("/:listingid", isAuthenticated, async (req, res, next) => {
  const { listingid } = req.params;
  const { user } = req.payload;
  try {
    const listing = await Listing.findById(listingid);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    if (listing.hostId.toString() !== user._id) {
      return res
        .status(403)
        .json({ message: "User not authorized to update listing" });
    }
    const updatedListing = await Listing.findByIdAndUpdate(
      listingid,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
});

router.delete("/:listingid", isAuthenticated, async (req, res, next) => {
  const { listingid } = req.params;
  const { user } = req.payload;

  try {
    const listing = await Listing.findById(listingid);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    if (listing.hostId.toString() !== user._id) {
      return res
        .status(403)
        .json({ message: "User not authorized to delete listing" });
    }
    await Listing.findByIdAndDelete(listingid);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

router.get("/:listingid/bookings", async (req, res, next) => {
  const listingId = req.params.listingid;
  try {
    const bookings = await Booking.find({
      listingId,
      status: { $in: ["pending", "confirmed"] },
    }).select("checkIn checkOut");
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
