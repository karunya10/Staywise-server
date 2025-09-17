const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
const upload = multer({ dest: "uploads/" });
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const normalizeFormData = require("../middleware/normalizeListingFormData.middleware");

const Listing = require("../models/listing.model");
const Booking = require("../models/booking.model");
const {
  listingValidation,
  validateListingIdParam,
  getListingsValidation,
  getListingsByIdsValidation,
} = require("../validators/listing.validator");
const {
  handleValidationErrors,
} = require("../middleware/validation.middleware");

const isAuthenticated = require("../middleware/auth.middleware");



router.get(
  "/",
  getListingsValidation,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { city, page = 1, limit = 10 } = req.query;
      let filter = {};
      if (city) {
        filter["address.city"] = { $eq: city };
      }
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const response = await Listing.find(filter)
        .sort({ createdAt: -1 })
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
  }
);

router.post(
  "/by-ids",
  getListingsByIdsValidation,
  handleValidationErrors,
  async (req, res, next) => {
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
  }
);

// Get current user's Listing's--> The one he/she owns! Host
router.get("/host", isAuthenticated, async (req, res, next) => {
  try {
    const { user } = req.payload;
    const response = await Listing.find({ hostId: user._id });
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:listingid",
  validateListingIdParam,
  handleValidationErrors,
  async (req, res, next) => {
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
  }
);

// -----For Host --> For FE Guest calendar block the calendar for this booking!
router.get(
  "/:listingid/bookings",
  validateListingIdParam,
  handleValidationErrors,
  async (req, res, next) => {
    const listingId = req.params.listingid;

    try {
      const listing = await Listing.findById(listingId);
      if (listing.length === 0) {
        return res.status(404).json({ message: "Listing not Found" });
      }
      const bookings = await Booking.find({
        listingId,
        status: { $in: ["confirmed"] },
      }).select("checkIn checkOut");
      res.status(200).json(bookings);
    } catch (error) {
      next(error);
    }
  }
);

//Host
router.post(
  "/",
  isAuthenticated,
  upload.single("photo"),
  normalizeFormData,
  listingValidation,
  handleValidationErrors,
  async (req, res, next) => {
    const { user } = req.payload;
    const listingData = req.body;
    listingData.hostId = user._id;

   
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "listings",
      });
      console.log(result);
      fs.unlinkSync(req.file.path);
      listingData.photos = [];
      listingData.photos.push(result.secure_url);
     
    }
    try {
      const response = await Listing.create(listingData);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
);

//Host
router.put(
  "/:listingid",
  isAuthenticated,
  validateListingIdParam,
  listingValidation,
  handleValidationErrors,
  async (req, res, next) => {
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
  }
);

//Host
const { cascadeDeleteListing } = require("../utils/cascadeDelete");
router.delete(
  "/:listingid",
  isAuthenticated,
  validateListingIdParam,
  handleValidationErrors,
  async (req, res, next) => {
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
     
      await cascadeDeleteListing(listingid);
      await Listing.findByIdAndDelete(listingid);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
