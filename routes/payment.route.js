const paymentController = require("../controllers/payment.controller");
const authJwt = require("../middlewares/authJwt");
const verifyPaymentReqBody = require("../middlewares/verifyPaymentReqBody");
// const { authJwt, verifyPaymentReqBody } = require("../middlewares");

/**
 * Routes for the booking resource
 */

module.exports = function (app) {
    app.get(
        "/mba/api/v1/payments",
        [authJwt.verifyToken],
        paymentController.getAllPayments
    );
    app.get(
        "/mba/api/v1/payments/:id",
        [authJwt.verifyToken],
        paymentController.getPaymentOnId
    );
    app.post(
        "/mba/api/v1/payments",
        [authJwt.verifyToken, verifyPaymentReqBody.validatePaymentRequestBody],
        paymentController.createPayment
    );
};
