const express = require("express");
const UserModels = require("./users-model");
const md = require("./users-middleware");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const md2 = require("../auth/auth-middleware");

const router = express.Router();

router.use(express.json());
router.use(cors());

router.get("/", md2.restricted, md2.rolenameCheck, (req, res, next) => {
  UserModels.getAll()
    .then((response) => res.status(200).json(response))
    .catch((err) => next({ status: 500, message: "database problem" }));
});

router.get("/:id", md.checkId, (req, res, next) => {
  UserModels.getById(req.params.id)
    .then((response) => res.status(200).json(response))
    .catch((err) => next({ status: 500, message: "database problem" }));
});

router.post("/", md.checkPayload, md.usernameUnique, (req, res, next) => {
  const hash = bcrypt.hashSync(req.body.password, 8);
  req.body.password = hash;
  UserModels.register(req.body)
    .then((response) => res.status(201).json(response))
    .catch((err) => next({ status: 500, message: "database problem" }));
});

router.use((err, req, res, next) => {
  res.status(err.status).json({ message: err.message });
});

module.exports = router;
