const {
    createPayment,
    getAllPayments,
    getPaymentById,
} = require("../controllers/payment.controller");
const { verifyToken, isAdmin } = require("../middlewares/authJwt");

module.exports = function (app) {
    app.post("/mba/api/v1/payments", [verifyToken], createPayment);

    app.get("/mba/api/v1/payments", [verifyToken], getAllPayments);

    app.get("/mba/api/v1/payments/:id", [verifyToken], getPaymentById);
};
