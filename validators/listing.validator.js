const { body, param, query } = require("express-validator");

const listingValidation = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string")
    .isLength({ max: 140 })
    .withMessage("Title can be at most 140 characters"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("pricePerNight")
    .notEmpty()
    .withMessage("Price per night is required")
    .isFloat({ min: 0 })
    .withMessage("Price per night must be a non-negative number"),

  body("address.line1").notEmpty().withMessage("Street is required").isString(),

  body("address.line2").notEmpty().withMessage("Street is required").isString(),

  body("address.city").notEmpty().withMessage("City is required").isString(),

  body("address.state").notEmpty().withMessage("State is required").isString(),

  body("address.country")
    .notEmpty()
    .withMessage("Country is required")
    .isString(),

  body("address.postalCode")
    .notEmpty()
    .withMessage("Postal code is required")
    .isPostalCode("any")
    .withMessage("Invalid postal code"),

  body("amenities")
    .optional()
    .isArray()
    .withMessage("Amenities must be an array of strings"),

  body("amenities.*")
    .optional()
    .isString()
    .withMessage("Each amenity must be a string"),

  body("maxGuests")
    .notEmpty()
    .withMessage("Max guests is required")
    .isInt({ min: 1 })
    .withMessage("Max guests must be at least 1"),

  body("bedrooms")
    .notEmpty()
    .withMessage("Bedrooms is required")
    .isInt({ min: 1 })
    .withMessage("Bedrooms must be 1 or more"),

  body("bathrooms")
    .notEmpty()
    .withMessage("Bathrooms is required")
    .isInt({ min: 1 })
    .withMessage("Bathrooms must be 1 or more"),
];

const validateListingIdParam = [
  param("listingid")
    .isMongoId()
    .withMessage("Listing ID must be a valid MongoDB ObjectId"),
];

const getListingsValidation = [
  query("city").optional().isString().withMessage("City must be a string"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("Limit must be between 1 and 20"),
];

const getListingsByIdsValidation = [
  body("ids")
    .isArray({ min: 1 })
    .withMessage("'ids' must be a non-empty array"),

  body("ids.*")
    .isMongoId()
    .withMessage("Each id must be a valid MongoDB ObjectId"),
];

module.exports = {
  listingValidation,
  validateListingIdParam,
  getListingsValidation,
  getListingsByIdsValidation,
};
