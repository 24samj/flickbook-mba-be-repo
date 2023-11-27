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
    console.log("params is ", req.params);
    const userIdReq = req.params.userId;
    try {
        const user = await User.findOneAndUpdate(
            {
                userId: userIdReq,
            },
            {
                name: req.body.name,
                userStatus: req.body.userStatus,
                userType: req.body.userType,
                email: req.body.email,
            }
        ).exec();
        res.status(200).send({
            message: `User record has been updated successfully`,
        });
    } catch (err) {
        console.log("Error while updating the record", err.message);
        res.status(500).send({
            message: "Some internal error occured",
        });
    }
}

module.exports = {
    getAllUsers,
    updateUserStatus,
    updateUserDetails,
};
