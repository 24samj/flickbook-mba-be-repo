const { USERTYPES } = require("../constant");
const Booking = require("../models/booking.model");
const Payment = require("../models/payment.model");
const User = require("../models/user.model");

async function createPayment(req, res) {
  const payment = await Payment.create(req.body);
  res.status(201).send(payment);
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

      if (userId === user._id) {
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
