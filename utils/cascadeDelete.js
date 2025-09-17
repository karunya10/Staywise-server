const Booking = require("../models/booking.model");
const Review = require("../models/review.model");
const User = require("../models/user.model");
const Listing = require("../models/listing.model");

async function cascadeDeleteListing(listingId) {
  await Booking.deleteMany({ listingId: listingId });

  await Review.deleteMany({ listingId });

  await User.updateMany(
    { favorites: listingId },
    { $pull: { favorites: listingId } }
  );
}

async function cascadeDeleteUserData(userid) {
  const userListings = await Listing.find({ hostId: userid }, "_id");
  const listingIds = userListings.map((listing) => listing._id);

  if (listingIds.length > 0) {
    await Booking.deleteMany({ listingId: { $in: listingIds } });
  }

  await Listing.deleteMany({ hostId: userid });
  await Booking.deleteMany({ guestId: userid });
  await Review.deleteMany({ authorId: userid });
}

module.exports = { cascadeDeleteListing, cascadeDeleteUserData };
