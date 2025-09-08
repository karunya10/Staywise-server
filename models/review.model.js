const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
  {
    listingId: { type: Schema.Types.ObjectId, ref: "Listing", required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = model("Review", reviewSchema);
