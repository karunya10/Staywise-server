const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    favorites: [{ type: Schema.Types.ObjectId, ref: "Listing" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
