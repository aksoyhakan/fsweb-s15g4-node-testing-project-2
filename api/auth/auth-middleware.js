const db = require("../../data/db-config");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../secret/index");

function restricted(req, res, next) {
  const token = req.headers.authorization;
  !token && next({ status: 406, message: "There is no token" });

  jwt.verify(token, JWT_SECRET, (err, decodeJwt) => {
    if (err) {
      next({ status: 406, message: "Invalid token" });
    } else {
      req.jwtData = decodeJwt;
      next();
    }
  });
}

async function usernameExisting(req, res, next) {
  const searchedUser = await db("users")
    .where("username", req.body.username)
    .first();

  if (searchedUser) {
    req.userData = searchedUser;
    next();
  } else next({ status: 404, message: "user not found" });
}

function rolenameCheck(req, res, next) {
  const role = req.jwtData.role;
  role === "admin"
    ? next()
    : next({ status: 407, message: "You do not have authorization" });
}

module.exports = { usernameExisting, restricted, rolenameCheck };
