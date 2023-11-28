const {
    getAllTheatres,
    getTheatreById,
    createTheatre,
    updateTheatre,
    deleteTheatre,
    addMoviesToATheatre,
    removeMoviesFromATheatre,
} = require("../controllers/theatre.controller");
const {
    verifyToken,
    isAdminOrClient,
    isAdmin,
} = require("../middlewares/authJwt");
const isTheatreOwnerOrAdmin = require("../middlewares/theatre");

module.exports = function (app) {
    app.get("/mba/api/v1/theatres", [verifyToken], getAllTheatres);

    app.get("/mba/api/v1/theatres/:id", [verifyToken], getTheatreById);

    app.post(
        "/mba/api/v1/theatres",
        [verifyToken, isAdminOrClient],
        createTheatre
    );

    app.put(
        "/mba/api/v1/theatres/:id",
        [verifyToken, isAdminOrClient, isTheatreOwnerOrAdmin],
        updateTheatre
    );

    app.delete(
        "/mba/api/v1/theatres/:id",
        [verifyToken, isAdminOrClient, isTheatreOwnerOrAdmin],
        deleteTheatre
    );

    app.put(
        "/mba/api/v1/theatres/:id/movies",
        [verifyToken, isAdminOrClient, isTheatreOwnerOrAdmin],
        (req, res) => {
            const { id } = req.params;

            // Check if the request includes a "add" or "remove" property in the body
            const { add, remove } = req.body;

            if (add) {
                console.log("calling add func");
                // Handle adding movies to a theatre
                addMoviesToATheatre(req, res);
            } else if (remove) {
                console.log("calling remove func");
                // Handle removing movies from a theatre
                removeMoviesFromATheatre(req, res);
            } else {
                res.status(400).json({ error: "Invalid operation" });
            }
        }
    );
};
