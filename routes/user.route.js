const { getAllUsers, updateUser } = require("../controllers/user.controller");

module.exports = function (app) {
  app.get("/mba/api/v1/users", getAllUsers);

  app.put("/mba/api/v1/users/:id", updateUser);
};
