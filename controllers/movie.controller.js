const Movie = require("../models/movie.model");

async function getAllMovies(req, res) {
    const movies = await Movie.find();
    res.status(200).send(movies);
}

async function getMovieById(req, res) {
    try {
        const id = req.params.id;
        const movie = await Movie.findById(id);

        res.status(200).send(movie);
    } catch (ex) {
        res.status(404).send({
            message: "Movie id does not exist",
        });
    }
}

async function createMovie(req, res) {
    const movie = req.body;

    const createdMovie = await Movie.create(movie);

    res.status(201).send(createdMovie);
}

async function updateMovie(req, res) {
    const id = req.params.id;
    console.log(req.body);

    // Extract day, month, and year from the date string
    const [day, month, year] = req.body.releaseDate.split("-");

    // Create a new Date object using the extracted components

    const updatedMovie = await Movie.findOneAndUpdate(
        {
            _id: id,
        },
        {
            name: req.body.name,
            description: req.body.description,
            director: req.body.director,
            posterUrl: req.body.posterUrl,
            trailerUrl: req.body.trailerUrl,
            releaseStatus: req.body.releaseStatus,
            releaseDate: new Date(year, month - 1, day), // Use the formatted date
        }
    ).exec();
    // const updatedMovie = await Movie.findByIdAndUpdate(id, req.body);

    res.send(updatedMovie);
}

async function deleteMovie(req, res) {
    const id = req.params.id;

    await Movie.findByIdAndDelete(id);

    res.send();
}

module.exports = {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
};
