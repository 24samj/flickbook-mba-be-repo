const Theatre = require("../models/theatre.model");
const User = require("../models/user.model");
const sendMail = require("../utils/notification");

async function getAllTheatres(req, res) {
  const theatres = await Theatre.find();
  res.status(200).send(theatres);
}

async function getTheatreById(req, res) {
  const id = req.params.id;

  try {
    const theatre = await Theatre.findById(id);
    res.status(200).send(theatre);
  } catch (ex) {
    res.status(404).send({
      message: `Theatre with ID : ${id} does not exist`,
    });
  }
}

async function createTheatre(req, res) {
  const theatre = req.body;
  try {
    const newTheatre = await Theatre.create(theatre);
    res.status(201).send(newTheatre);
  } catch (ex) {
    res.status(400).send({
      message: "Theatre body is invalid",
    });
  }
}

async function updateTheatre(req, res) {
  const id = req.params.id;

  try {
    Theatre.findById(id);
  } catch (ex) {
    res.status(404).send({
      message: "Theatre does not exist",
    });
  }

  const updatedTheatre = await Theatre.findByIdAndUpdate(id, req.body);
  res.send(updatedTheatre);
}

async function deleteTheatre(req, res) {
  const id = req.params.id;

  try {
    Theatre.findById(id);
  } catch (ex) {
    res.status(404).send({
      message: "Theatre does not exist",
    });
  }

  await Theatre.findByIdAndDelete(id);
  res.send();
}

async function addMoviesToATheatre(req, res) {
  const moviesToBeAdded = req.body;

  if (!Array.isArray(moviesToBeAdded)) {
    return res.status(400).send({
      message: "Request body should be an array of movie ids",
    });
  }

  const theatreId = req.params.id;

  try {
    const theatre = await Theatre.findById(theatreId);
    const existingMovies = theatre.movies;
    const updatedMovies = [...moviesToBeAdded, ...existingMovies];
    theatre.movies = updatedMovies;
    const updatedTheatre = await Theatre.findByIdAndUpdate(theatreId, theatre);
    const user = await User.findOne({ _id: theatre.ownerId });
    sendMail(
      theatreId,
      "New movies are added",
      "New movies have been successfully added to your theatre. Check them in the application now.",
      [user.email]
    );
    res.status(200).send(updatedTheatre);
  } catch (ex) {
    res.status(404).send({
      message: `Theatre with ID: ${theatreId} does not exist`,
    });
  }
}

module.exports = {
  getAllTheatres,
  getTheatreById,
  createTheatre,
  updateTheatre,
  deleteTheatre,
  addMoviesToATheatre,
};
