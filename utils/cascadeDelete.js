const Booking = require("../models/booking.model");
const Review = require("../models/review.model");
const User = require("../models/user.model");

async function cascadeDeleteListing(listingId) {
  await Booking.deleteMany({ listingId: listingId });

  await Review.deleteMany({ listingId });

  await User.updateMany(
    { favorites: listingId },
    { $pull: { favorites: listingId } }
  );
}

module.exports = { cascadeDeleteListing };
