const { USERTYPES } = require("../constant");
const Booking = require("../models/booking.model");
const Theatre = require("../models/theatre.model");
const User = require("../models/user.model");

async function getAllBookings(req, res) {
  // if it is an admin, return all bookings
  // if it is an owner, then return bookings for their theatres only
  // if it is a customer, then return only their booking

  if (req.userType === USERTYPES.ADMIN) {
    const bookings = await Booking.find();
    res.status(200).send(bookings);
    return;
  }

  const userId = req.userId;
  const user = await User.find({ userId: userId });

  if (req.userType === USERTYPES.CUSTOMER) {
    const bookings = await Booking.find({ userId: user._id });
    res.status(200).send(bookings);
  } else {
    // user is a owner
    const theatresOwned = await Theatre.find({ ownerId: user._id }).select(
      "_id"
    );
    const bookingsInOwnedTheatres = await Booking.find({
      theatreId: { $in: theatresOwned },
    });
    res.status(200).send(bookingsInOwnedTheatres);
  }
}

async function getBookingById(req, res) {
  try {
    const booking = await Booking.findById(req.params.id);
    if (req.userType === USERTYPES.ADMIN || req.userType === USERTYPES.CLIENT) {
      res.send(booking);
    } else if (req.userType === USERTYPES.CUSTOMER) {
      // Callee is a customer
      // Return the booking only if it is made by the customer

      const userId = req.userId;
      const user = await User.find({ userId: userId });

      if (booking.userId === user._id) {
        res.send(booking);
      } else {
        res.status(403).send({
          message: `This booking is not created by the current user.`,
        });
      }
    }
  } catch (ex) {
    res.status(404).send({
      message: `Booking with ID: ${req.params.id} does not exist`,
    });
  }
}

async function updateBooking(req, res) {
  if (req.userType === USERTYPES.ADMIN || req.userType === USERTYPES.CLIENT) {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    res.send(updatedBooking);
  } else if (req.userType === USERTYPES.CUSTOMER) {
    // Callee is a customer
    // Update the booking only if it is made by the customer

    const userId = req.userId;
    const user = await User.find({ userId: userId });

    try {
      const booking = await Booking.findById(req.params.id);
      if (booking.userId === user._id) {
        const updatedBooking = await Booking.findByIdAndUpdate(
          req.params.id,
          req.body
        );
        res.send(updatedBooking);
      } else {
        res.status(403).send({
          message: `User can only update a booking created by them`,
        });
      }
    } catch (ex) {
      res.status(404).send({
        message: `Booking with ID: ${req.params.id} does not exist`,
      });
    }
  }
}

async function createBooking(req, res) {
  const booking = await Booking.create(req.body);
  res.status(201).send(booking);
}

module.exports = {
  getAllBookings,
  getBookingById,
  updateBooking,
  createBooking,
};
