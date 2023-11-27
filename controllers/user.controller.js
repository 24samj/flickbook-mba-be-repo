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
        console.log(req.body);
        const { body } = req;
        const { id } = req.params;

        const user = await User.findOne({ userId: req.userId });

        // if (user._id.toString() !== id) {
        //     res.status(403).send({
        //         message: "Cannot update the details of a user other than self",
        //     });
        //     return;
        // }

        const updateObj = {};

        updateObj.userStatus = body.userStatus;
        updateObj.userType = body.userType;
        updateObj.email = body.email;
        updateObj.name = body.name;

        if (body.password) {
            updateObj.password = bcrypt.hashSync(body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateObj);
        res.status(200).send(updatedUser);
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
