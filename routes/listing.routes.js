const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.model");
const Booking = require("../models/booking.model");

const isAuthenticated = require("../middleware/auth.middleware");

router.get("/", async (req, res, next) => {
  try {
    const { city, page = 1, limit = 10 } = req.query;
    let filter = {};
    if (city) {
      filter["address.city"] = { $eq: city, $options: "i" };
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const response = await Listing.find(filter)
      .skip(skip)
      .limit(parseInt(limit));
    const total = await Listing.countDocuments(filter);
    res.status(200).json({
      data: response,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    next(error);
  }
});

router.post("/by-ids", async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ message: "'ids' must be a non-empty array" });
    }
    const listings = await Listing.find({ _id: { $in: ids } });
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
});

//Get current user's Listing's--> The one he/she owns!
router.get("/host", isAuthenticated, async (req, res, next) => {
  try {
    const { user } = req.payload;
    const response = await Listing.find({ hostId: user._id });
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

router.get("/:listingid", async (req, res, next) => {
  const { listingid } = req.params;
  try {
    const response = await Listing.findById(listingid).populate({
      path: "hostId",
      select: "-password",
    });
    if (!response)
      return res.status(404).json({ message: "Listing not found" });
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

//For Guest, Host can also see---> For FE Guest calendar
router.get("/:listingid/bookings", async (req, res, next) => {
  const listingId = req.params.listingid;
  try {
    const bookings = await Booking.find({
      listingId,
      status: { $in: ["confirmed"] },
    }).select("checkIn checkOut");
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
});

router.post("/", isAuthenticated, async (req, res, next) => {
  const { user } = req.payload;
  const listingData = { ...req.body, hostId: user._id };
  try {
    const response = await Listing.create(listingData);
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
    if (listing.hostId.toString() !== user._id.toString()) {
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

module.exports = router;
