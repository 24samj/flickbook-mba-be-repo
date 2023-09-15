const { signin, signup } = require("../controllers/auth.controller");

module.exports = function (app) {
  app.post("/mba/api/v1/auth/signin", signin);

  app.post("/mba/api/v1/auth/signup", signup);
};
