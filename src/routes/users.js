require('dotenv').config();
const config = require("../config/auth");
const { verifySignUp } = require("../middleware");
const User = require("../models/User");
const router = require("./customers");

let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");

router.post("/signup", [verifySignUp.checkDuplicateUsernameOrEmail], async (req, res) => {
    await User.create({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 8),
        role: req.body.role || 'USER'
    }).then(() => {
        res.send({ message: "User registered successfully" });
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
});

router.post("/signin", async (req, res) => {
    await User.findOne({ username: req.body.username })
    .then(async (user) => {
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).send({
            accessToken: null,
            message: "Invalid password"
            });
        }

        let token = jwt.sign({ sub: user.id, role: user.role }, config.secret, {
            expiresIn: config.jwtExpiration
        });

        res.status(200).send({
            id: user.id,
            username: user.username,
            accessToken: token
        });
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
});

module.exports = router;