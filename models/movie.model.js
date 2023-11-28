const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    casts: {
        type: [String],
        required: true,
    },
    trailerUrl: {
        type: String,
        required: true,
    },
    posterUrl: {
        type: String,
        required: true,
    },
    language: {
        type: [String],
        required: true,
    },
    genre: {
        type: String,
    },
    director: {
        type: String,
    },
    ratings: {
        type: Number,
    },
    releaseStatus: {
        type: String,
        required: true,
        default: "RELEASED",
    },
    releaseDate: {
        type: String, // assuming release date is a string
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

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
