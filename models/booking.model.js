const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Movie",
    required: true,
  },
  theatreId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Theatre",
    required: true,
  },
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  seats: {
    type: [String],
    required: true,
  },
  totalCost: {
    type: Number,
    required: true,
  },
  timing: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "CONFIRMED",
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
