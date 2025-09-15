const Booking = require("../models/booking.model");
const Review = require("../models/review.model");
const User = require("../models/user.model");

// Cascades deletion of bookings, reviews, and user favorites for a listing
async function cascadeDeleteListing(listingId) {
  // Delete all bookings for this listing
  await Booking.deleteMany({ listingId: listingId });
  // Delete all reviews for this listing
  await Review.deleteMany({ listingId });
  // Remove listing from all users' favorites
  await User.updateMany(
    { favorites: listingId },
    { $pull: { favorites: listingId } }
  );
  // No need to delete address separately, as it's embedded in Listing
}

module.exports = { cascadeDeleteListing };
