const { USERTYPES } = require("../constant");
const Theatre = require("../models/theatre.model");
const User = require("../models/user.model");

const isTheatreOwnerOrAdmin = async (req, res, next) => {
  const theatreId = req.params.id;

  const userId = req.userId;

  if (req.userType === USERTYPES.ADMIN) {
    return next();
  }

  // I need to verify if the ownerId of the theatre is equal to the _id of the user

  try {
    const theatre = await Theatre.findById(theatreId);
    const ownerId = theatre.ownerId.toString();

    const user = await User.findOne({ userId: userId });
    const id = user._id.toString();

    if (id === ownerId) {
      return next();
    } else {
      res.status(403).send({
        message: "Only theatre owner or admin can call this API",
      });
      return;
    }
  } catch (ex) {
    res.status(400).send({
      message: "Bad request",
    });
  }
};

module.exports = isTheatreOwnerOrAdmin;
