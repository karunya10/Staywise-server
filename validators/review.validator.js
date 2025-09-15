const { body, param } = require("express-validator");

const getByBookingValidation = [
  param("bookingId")
    .isMongoId()
    .withMessage("Booking ID must be a valid MongoDB ObjectId"),
];

const createReviewValidation = [
  body("listingId")
    .notEmpty()
    .withMessage("Listing ID is required")
    .isMongoId()
    .withMessage("Listing ID must be a valid MongoDB ObjectId"),

  body("bookingId")
    .notEmpty()
    .withMessage("Booking ID is required")
    .isMongoId()
    .withMessage("Booking ID must be a valid MongoDB ObjectId"),

  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be a number between 1 and 5"),

  body("comment")
    .optional()
    .isString()
    .withMessage("Comment must be a string")
    .trim(),
];

const updateReviewValidation = [
  param("reviewid")
    .isMongoId()
    .withMessage("Review ID must be a valid MongoDB ObjectId"),

  body("listingId")
    .notEmpty()
    .withMessage("Listing ID is required")
    .isMongoId()
    .withMessage("Listing ID must be a valid MongoDB ObjectId"),

  body("bookingId")
    .notEmpty()
    .withMessage("Booking ID is required")
    .isMongoId()
    .withMessage("Booking ID must be a valid MongoDB ObjectId"),

  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be a number between 1 and 5"),

  body("comment")
    .optional()
    .isString()
    .withMessage("Comment must be a string")
    .trim(),
];

const deleteReviewValidation = [
  param("reviewid")
    .isMongoId()
    .withMessage("Review ID must be a valid MongoDB ObjectId"),
];

const getByListingValidation = [
  param("listingId")
    .isMongoId()
    .withMessage("Listing ID must be a valid MongoDB ObjectId"),
];

module.exports = {
  getByBookingValidation,
  createReviewValidation,
  updateReviewValidation,
  deleteReviewValidation,
  getByListingValidation,
};
