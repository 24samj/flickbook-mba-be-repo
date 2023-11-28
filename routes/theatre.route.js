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
            const { add, remove } = req.body;

            if (add) {
                addMoviesToATheatre(req, res);
            } else if (remove) {
                removeMoviesFromATheatre(req, res);
            } else {
                res.status(400).json({ error: "Invalid operation" });
            }
        }
    );
};
