const { getAllUsers, updateUser } = require("../controllers/user.controller");
const { verifyToken, isAdmin } = require("../middlewares/authJwt");

module.exports = function (app) {
  app.get("/mba/api/v1/users", [verifyToken, isAdmin], getAllUsers);

  app.put("/mba/api/v1/users/:id", [verifyToken, isAdmin], updateUser);
};
