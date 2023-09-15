const { createPayment } = require("../controllers/payment.controller");
const { verifyToken } = require("../middlewares/authJwt");

module.exports = function (app) {
  app.post("/mba/api/v1/payments", [verifyToken], createPayment);
};
