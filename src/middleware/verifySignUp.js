const User = require("../models/User");

checkDuplicateUsernameOrEmail = (req, res, next) => {
    User.findOne({ username: req.body.username })
    .then(user => {
        if (user) {
            res.status(400).send({
                message: "Username is already in use"
            });
            return;
        }
        next();
    });
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail
};

module.exports = verifySignUp;