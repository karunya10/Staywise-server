const { Schema, model } = require("mongoose");
const addressSchema = require("./address.model");

const listingSchema = new Schema(
  {
    hostId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true, maxlength: 140 },
    description: { type: String, trim: true },
    pricePerNight: { type: Number, required: true, min: 0 },
    address: { type: addressSchema, required: true },
    amenities: { type: [String], default: [] },
    photos: { type: [String], default: [] },
    maxGuests: { type: Number, required: true, min: 1 },
    bedrooms: { type: Number, required: true, min: 0 },
    bathrooms: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

module.exports = model("Listing", listingSchema);
