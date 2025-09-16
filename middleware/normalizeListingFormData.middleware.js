function normalizeFormData(req, res, next) {

  req.body.address = {
    line1: req.body["address.line1"],
    line2: req.body["address.line2"],
    city: req.body["address.city"],
    state: req.body["address.state"],
    country: req.body["address.country"],
    postalCode: req.body["address.postalCode"],
  };

  req.body.pricePerNight = parseFloat(req.body.pricePerNight);
  req.body.maxGuests = parseInt(req.body.maxGuests);
  req.body.bedrooms = parseInt(req.body.bedrooms);
  req.body.bathrooms = parseInt(req.body.bathrooms);

  const amenities = [];
  Object.keys(req.body).forEach((key) => {
    if (key.startsWith("amenities[")) {
      amenities.push(req.body[key]);
    }
  });
  req.body.amenities = amenities.length > 0 ? amenities : undefined;

  next();
}

module.exports = normalizeFormData;
