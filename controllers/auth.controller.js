const User = require("./../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = require("../configs/auth.config");
const { USERTYPES, USER_STATUS } = require("./../constant");

function signup(req, res) {
    const { name, email, userId, password, userType } = req.body;

    const userObj = {
        name,
        email,
        userId,
        password: bcrypt.hashSync(password, 10),
        userType,
        userStatus:
            userType === USERTYPES.CUSTOMER
                ? USER_STATUS.APPROVED
                : USER_STATUS.APPROVED,
    };

    User.create(userObj)
        .then((data) => {
            res.status(200).send({
                _id: data._id,
                name: data.name,
                email: data.email,
                userId: data.userId,
                userType: data.userType,
                userStatus: data.userStatus,
            });
        })
        .catch((err) => res.status(400).send(err));
}

async function signin(req, res) {
    const { userId, password } = req.body;
    const user = await User.findOne({ userId: userId });

    if (user === null) {
        res.status(401).send({
            message: "Failed! UserId does not exist",
        });
        return;
    }

    if (user.userStatus !== USER_STATUS.APPROVED) {
        res.status(401).send({
            message: "Cannot allow login as user is not approved yet",
        });
        return;
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).send({
            message: "Password is invalid",
        });
    }

    // JWT token

    const accessToken = jwt.sign(
        {
            userId: user.userId,
            userType: user.userType,
            email: user.email,
        },
        SECRET_KEY,
        {
            expiresIn: "6h",
        }
    );

    res.status(200).send({
        name: user.name,
        userStatus: user.userStatus,
        email: user.email,
        userId: user.userId,
        userTypes: user.userType,
        accessToken,
    });
}

module.exports = {
    signup,
    signin,
};
