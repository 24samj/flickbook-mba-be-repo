const { USERTYPES } = require("../constant");
const Booking = require("../models/booking.model");
const Payment = require("../models/payment.model");
const User = require("../models/user.model");

async function createPayment(req, res) {
  // check if booking's userId is same as the user making this payment

  const bookingId = req.body.bookingId;
  try {
    const booking = await Booking.findById(bookingId);
    const userId = booking.userId;

    const user = await User.findOne({ userId: req.userId });

    if (user._id.toString() === userId.toString()) {
      const payment = await Payment.create(req.body);
      await Booking.findByIdAndUpdate(bookingId, {
        status: "CONFIRMED",
      });
      res.status(201).send(payment);
    } else {
      return res.status(400).send({
        message: `The current user has not made the booking with ID: ${bookingId}`,
      });
    }
  } catch (ex) {
    return res.status(404).send({
      message: `Booking with ID: ${bookingId} does not exist. Payment cannot be made for a non-existent booking`,
    });
  }
}

async function getAllPayments(req, res) {
  if (req.userType === USERTYPES.CUSTOMER) {
    const user = await User.findOne({ userId: req.userId });
    const userBookingsIds = await Booking.find({ userId: user._id }).select(
      "_id"
    );
    const paymentsMadeByUser = await Payment.find({
      bookingId: { $in: userBookingsIds },
    });
    res.send(paymentsMadeByUser);
  } else if (req.userType === USERTYPES.ADMIN) {
    const payments = await Payment.find();
    res.status(200).send(payments);
  } else {
    res
      .status(403)
      .send({ message: "You are forbidden from calling this API" });
  }
}

async function getPaymentById(req, res) {
  if (req.userType === USERTYPES.CUSTOMER) {
    const user = await User.findOne({ userId: req.userId });
    try {
      const payment = await Payment.findById(req.params.id);
      const bookingId = payment.bookingId;
      const booking = await Booking.findById(bookingId);
      const userId = booking.userId;

      if (userId.toString() === user._id.toString()) {
        res.send(payment);
      } else {
        res
          .status(403)
          .send({ message: "The payment is not made by the current user." });
      }
    } catch (ex) {
      res.status(404).send("Payment ID does not exist");
    }
  } else if (req.userType === USERTYPES.ADMIN) {
    try {
      const payment = await Payment.findById(req.params.id);
      res.status(200).send(payment);
    } catch (ex) {
      res.status(404).send("Payment ID does not exist");
    }
  } else {
    res
      .status(403)
      .send({ message: "You are forbidden from calling this API" });
  }
}

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
};
