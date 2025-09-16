const express = require("express");
const cors = require("cors");
const logger = require("morgan");
require("dotenv").config();
require("./config/index");
const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());

app.use("/public", express.static(require("path").join(__dirname, "public")));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/listings", require("./routes/listing.routes"));
app.use("/api/bookings", require("./routes/booking.routes"));
app.use("/api/reviews", require("./routes/review.routes"));

const { routeExist, serverError } = require("./error-handling/index");

routeExist(app);
serverError(app);

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
