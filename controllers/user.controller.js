const mongoose = require("mongoose");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const sendMail = require("../utils/notification");

async function getAllUsers(req, res) {
    try {
        const users = await User.find().select("-password");
        res.send(users);
    } catch (error) {
        console.error("Error in getAllUsers:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
}

async function updateUserStatus(req, res) {
    try {
        const { body } = req;
        const { id } = req.params;

        // Convert the id to a valid ObjectId using mongoose.Types.ObjectId
        const objectId = mongoose.Types.ObjectId(id);

        const updatedUser = await User.findByIdAndUpdate(
            { _id: objectId }, // Use an object to specify the query condition
            { userStatus: body.userStatus },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send({ message: "User not found" });
        }

        await sendMail(
            id,
            "User status has changed",
            `Your userStatus has been changed to ${req.body.userStatus}.`,
            [updatedUser.email]
        );

        res.status(200).send(updatedUser);
    } catch (error) {
        console.error("Error in updateUserStatus:", error);

        if (error.name === "CastError") {
            return res.status(400).send({ message: "Invalid user ID" });
        }

        res.status(500).send({ message: "Internal Server Error" });
    }
}

async function updateUserDetails(req, res) {
    try {
        const { body } = req;
        const { id } = req.params;

        // Convert the id to a valid ObjectId using mongoose.Types.ObjectId
        const objectId = mongoose.Types.ObjectId(id);

        const user = await User.findOne({ userId: req.userId });

        if (!user || user._id.toString() !== id) {
            return res.status(403).send({
                message: "Cannot update the details of a user other than self",
            });
        }

        const updateObj = {};

        updateObj.userId = body.userId;
        updateObj.email = body.email;
        updateObj.name = body.name;

        if (body.password) {
            updateObj.password = bcrypt.hashSync(body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            { _id: objectId }, // Use an object to specify the query condition
            updateObj,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send({ message: "User not found" });
        }

        res.status(200).send(updatedUser);
    } catch (error) {
        console.error("Error in updateUserDetails:", error);

        if (error.name === "CastError") {
            return res.status(400).send({ message: "Invalid user ID" });
        }

        res.status(500).send({ message: "Internal Server Error" });
    }
}

module.exports = {
    getAllUsers,
    updateUserStatus,
    updateUserDetails,
};
