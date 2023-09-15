const {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
} = require("../controllers/booking.controller");
const { verifyToken } = require("../middlewares/authJwt");

module.exports = function (app) {
  app.get("/mba/api/v1/bookings", [verifyToken], getAllBookings);

  app.get("/mba/api/v1/bookings/:id", [verifyToken], getBookingById);

  app.post("/mba/api/v1/bookings", [verifyToken], createBooking);

  app.put("/mba/api/v1/bookings/:id", [verifyToken], updateBooking);
};
