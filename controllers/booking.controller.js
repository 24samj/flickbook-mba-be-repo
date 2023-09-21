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
  const user = await User.findOne({ userId: userId });

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
  const userId = req.userId;
  const user = await User.findOne({ userId: userId });

  try {
    const booking = await Booking.findById(req.params.id);
    if (req.userType === USERTYPES.ADMIN) {
      res.send(booking);
    } else if (req.userType === USERTYPES.CUSTOMER) {
      // Callee is a customer
      // Return the booking only if it is made by the customer

      if (booking.userId === user._id) {
        res.send(booking);
      } else {
        res.status(403).send({
          message: `This booking is not created by the current user.`,
        });
      }
    } else {
      // user is a owner
      const theatresOwned = await Theatre.find({ ownerId: user._id }).select(
        "_id"
      );

      const bookingsInOwnedTheatres = await Booking.findOne({
        theatreId: { $in: theatresOwned },
        _id: req.params.id,
      });
      res.status(200).send(bookingsInOwnedTheatres);
    }
  } catch (ex) {
    res.status(404).send({
      message: `Booking with ID: ${req.params.id} does not exist`,
    });
  }
}

async function updateBooking(req, res) {
  const userId = req.userId;
  const user = await User.findOne({ userId: userId });

  if (req.userType === USERTYPES.ADMIN) {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    res.send(updatedBooking);
  } else if (req.userType === USERTYPES.CUSTOMER) {
    // Callee is a customer
    // Update the booking only if it is made by the customer

    try {
      const booking = await Booking.findById(req.params.id);
      if (booking.userId.toString() === user._id.toString()) {
        const updatedBooking = await Booking.findByIdAndUpdate(
          req.params.id,
          req.body
        );
        return res.send(updatedBooking);
      } else {
        return res.status(403).send({
          message: `User can only update a booking created by them`,
        });
      }
    } catch (ex) {
      res.status(404).send({
        message: `Booking with ID: ${req.params.id} does not exist`,
      });
    }
  } else {
    const theatresOwned = await Theatre.find({ ownerId: user._id }).select(
      "_id"
    );

    const bookingsInOwnedTheatres = await Booking.findOne({
      theatreId: { $in: theatresOwned },
      _id: req.params.id,
    });

    if (bookingsInOwnedTheatres) {
      const updatedBooking = await Booking.findByIdAndUpdate(
        req.params.id,
        req.body
      );
      res.send(updatedBooking);
    } else {
      res.send({ message: "User is not allowed to update this booking" });
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
