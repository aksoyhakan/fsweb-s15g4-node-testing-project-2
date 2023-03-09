const express = require("express");
const UserModels = require("../users/users-model");
const md = require("./auth-middleware");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../secret/index");

const router = express.Router();

router.use(express.json());

function generateToken(data) {
  let payload = {
    subject: data.user_id,
    username: data.username,
    role: data.role,
  };
  let option = {
    expiresIn: "1d",
  };

  return jwt.sign(payload, JWT_SECRET, option);
}

router.post("/login", md.usernameExisting, (req, res, next) => {
  if (bcrypt.compareSync(req.body.password, req.userData.password)) {
    const token = generateToken(req.userData);
    res
      .status(200)
      .json({ message: `Welcome ${req.userData.username}`, token: token });
  } else next({ status: 404, message: "invalid data" });
});

router.use((err, req, res, next) => {
  res.status(err.status).json({ message: err.message });
});

module.exports = router;
