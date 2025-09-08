const { Schema, model } = require("mongoose");

const bookingSchema = new Schema(
  {
    listingId: { type: Schema.Types.ObjectId, ref: "Listing", required: true },
    guestId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

bookingSchema.path("checkOut").validate(function (value) {
  return this.checkIn && value > this.checkIn;
}, "checkOut must be after checkIn.");

module.exports = model("Booking", bookingSchema);
