const jwt = require("jsonwebtoken");
const SECRET_KEY = require("../configs/auth.config");
const { USERTYPES } = require("../constant");
const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    res.status(401).send({
      message: "No access token provided",
    });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(401).send({
        message: "Access token is invalid",
      });
      return;
    }

    req.userId = decoded.userId;
    req.userType = decoded.userType;
    next();
  });
};

const isAdmin = (req, res, next) => {
  // If isAdmin has been called directly, then we need to decode the token and check admin

  if (!req.userId) {
    let token = req.headers["x-access-token"];

    if (!token) {
      res.status(401).send({
        message: "No access token provided",
      });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(401).send({
          message: "Access token is invalid",
        });
        return;
      }

      req.userId = decoded.userId;
      req.userType = decoded.userType;
    });
  }

  if (req.userId && req.userType && req.userType === USERTYPES.ADMIN) {
    return next();
  } else if (req.userType !== USERTYPES.ADMIN) {
    res.status(403).send({
      message: "USER is not an admin",
    });
  }
};

const isAdminOrClient = (req, res, next) => {
  // If isAdminOrClient has been called directly, then we need to decode the token and check admin or client

  if (!req.userId) {
    let token = req.headers["x-access-token"];

    if (!token) {
      res.status(401).send({
        message: "No access token provided",
      });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(401).send({
          message: "Access token is invalid",
        });
        return;
      }

      req.userId = decoded.userId;
      req.userType = decoded.userType;
    });
  }

  if (
    req.userId &&
    req.userType &&
    (req.userType === USERTYPES.ADMIN || req.userType === USERTYPES.CLIENT)
  ) {
    next();
  } else if (
    req.userType !== USERTYPES.ADMIN &&
    req.userType !== USERTYPES.CLIENT
  ) {
    res.status(403).send({
      message: "USER is not an admin or client",
    });
  }
};

module.exports = {
  isAdmin,
  isAdminOrClient,
  verifyToken,
};
