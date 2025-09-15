const { body, param } = require("express-validator");

const updateUserValidation = [
  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 2, max: 10 })
    .withMessage("Name must be of length > 2 and < than 10 characters"),

  body("email").optional().isEmail().withMessage("Email must be a string"),
  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Phone number must be valid"),
  body("address.line1")
    .optional()
    .isString()
    .withMessage("Street must be a string"),

  body("address.line2")
    .optional()
    .isString()
    .withMessage("Street must be a string"),

  body("address.city")
    .optional()
    .isString()
    .withMessage("City must be a string"),

  body("address.country")
    .optional()
    .isString()
    .withMessage("Country must be a string"),

  body("address.state")
    .optional()
    .isString()
    .withMessage("State must be a string"),

  body("address.postalCode")
    .optional()
    .isPostalCode("any")
    .withMessage("Postal code must be valid"),
];

const favoritesValidation = [
  param("listingid")
    .isMongoId()
    .withMessage("Listing ID must be a valid MongoDB ObjectId"),
];

module.exports = { updateUserValidation, favoritesValidation };
