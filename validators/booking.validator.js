const { body, param } = require("express-validator");

const createBookingValidation = [
  body("listingId")
    .notEmpty()
    .withMessage("Listing ID is required")
    .isMongoId()
    .withMessage("Listing ID must be a valid MongoDB ObjectId"),

  body("checkIn")
    .notEmpty()
    .withMessage("Check-in date is required")
    .isISO8601()
    .toDate()
    .withMessage("Check-in must be a valid date"),

  body("checkOut")
    .notEmpty()
    .withMessage("Check-out date is required")
    .isISO8601()
    .toDate()
    .withMessage("Check-out must be a valid date")
    .custom((value, { req }) => {
      if (!req.body.checkIn) return true;
      const checkInDate = new Date(req.body.checkIn);
      const checkOutDate = new Date(value);
      if (checkOutDate <= checkInDate) {
        throw new Error("Check-out must be after check-in");
      }
      return true;
    }),

  body("status")
    .optional()
    .isIn(["pending", "confirmed", "cancelled", "completed"])
    .withMessage(
      "Status must be one of: pending, confirmed, cancelled, completed"
    ),

  body("totalPrice")
    .notEmpty()
    .withMessage("Total price is required")
    .isFloat({ min: 0 })
    .withMessage("Total price must be a non-negative number"),
];

const validateBookingIdParam = [
  param("bookingid")
    .isMongoId()
    .withMessage("Booking ID must be a valid MongoDB ObjectId"),
];

module.exports = {
  createBookingValidation,
  validateBookingIdParam,
};
