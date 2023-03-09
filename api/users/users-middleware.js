const UserModels = require("./users-model");
const db = require("../../data/db-config");

function checkId(req, res, next) {
  console.log(req.params.id);
  UserModels.getById(req.params.id)
    .then((response) => {
      response.user_id
        ? next()
        : next({
            status: 404,
            message: `ID No: ${req.params.id} is not found`,
          });
    })
    .catch((err) => next({ status: 500, message: "database problem" }));
}

function checkPayload(req, res, next) {
  const array = ["username", "email", "institute", "password", "role"];
  array.forEach((item) => {
    !req.body[item] &&
      next({ status: 401, message: `${item} property is missing` });
  });

  next();
}

async function usernameUnique(req, res, next) {
  const selectedUser = await db("users")
    .where("username", req.body.username)
    .first();
  selectedUser
    ? next({ status: 402, message: `username is already used` })
    : next();
}

module.exports = { checkId, checkPayload, usernameUnique };
