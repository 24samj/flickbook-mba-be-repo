const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const sendMail = require("../utils/notification");

async function getAllUsers(req, res) {
    const users = await User.find().select("-password");
    res.send(users);
}

async function updateUserStatus(req, res) {
    const { body } = req;
    const { id } = req.params;

    const updatedUser = await User.findByIdAndUpdate(id, {
        userStatus: body.userStatus,
    });
    sendMail(
        id,
        "User status has changed",
        `Your userStatus has been changed to ${req.body.userStatus}.`,
        [updatedUser.email]
    );
    res.status(200).send(updatedUser);
}

async function updateUserDetails(req, res) {
    try {
        const { body } = req;
        const id = req.body.userId;

        const user = await User.findOne({ userId: id });

        if (body.password) {
            updateObj.password = bcrypt.hashSync(body.password, 10);
        }

        const updatedUser = await User.findOneAndUpdate(
            {
                userId: id,
            },
            {
                name: body.name,
                userStatus: body.userStatus,
                userType: body.userType,
                email: body.email,
            }
        ).exec();
        res.status(200).send({
            message: `User record has been updated successfully`,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Internal server error",
        });
    }
}

module.exports = {
    getAllUsers,
    updateUserStatus,
    updateUserDetails,
};
