const express = require("express");
const router = express.Router();

const Booking = require("../models/booking.model");
const Listing = require("../models/listing.model");
const isAuthenticated = require("../middleware/auth.middleware");

router.get("/", isAuthenticated, async (req, res, next) => {
  const user = req.payload.user;
  try {
    const bookings = await Booking.find({ guestId: user._id }).populate({
      path: "listingId",
      select: "title description photos",
    });

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

router.put("/:bookingid/cancel", isAuthenticated, async (req, res, next) => {
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
        .json({ message: "Not authorized to cancel this booking" });
    }
    booking.status = "cancelled";
    await booking.save();
    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
});

// for the Host
router.put(
  "/:bookingid/cancel/host",
  isAuthenticated,
  async (req, res, next) => {
    const { bookingid } = req.params;
    const { user } = req.payload;
    try {
      const booking = await Booking.findById(bookingid).populate("listingId");
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      const hostid = booking.listingId.hostId;
      if (hostid.toString() !== user._id.toString()) {
        return res
          .status(403)
          .json({ message: "Not authorized to cancel this booking" });
      }
      booking.status = "cancelled";
      await booking.save();
      res.status(200).json(booking);
    } catch (error) {
      next(error);
    }
  }
);

//see tomorrow
router.post("/", isAuthenticated, async (req, res, next) => {
  const newBooking = req.body;
  const { listingId, checkIn, checkOut } = newBooking;

  try {
    const overlappingBooking = await Booking.findOne({
      listingId,
      status: { $in: ["pending", "confirmed"] },
      $or: [
        {
          checkIn: { $lt: checkOut },
          checkOut: { $gt: checkIn },
        },
      ],
    });

    if (overlappingBooking) {
      return res
        .status(409)
        .json({ message: "Listing not available for these dates" });
    }

    const booking = await Booking.create(newBooking);
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
