const User = require("../models/user.model");
const bcrypt = require("bcrypt");

async function getAllUsers(req, res) {
  const users = await User.find();
  res.send(users);
}

async function updateUser(req, res) {
  const { body } = req;
  const { id } = req.params;

  if (body.password) {
    body.password = bcrypt.hashSync(body.password, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(id, body);
  res.status(200).send(updatedUser);
}

module.exports = {
  getAllUsers,
  updateUser,
};
