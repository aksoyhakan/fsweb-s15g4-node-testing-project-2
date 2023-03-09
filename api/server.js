const express = require("express");
const userRoutes = require("./users/users-route");
const authRoutes = require("./auth/auth-route");

const server = express();

server.use(express.json());
server.use("/api/users", userRoutes);
server.use("/api/auth", authRoutes);

module.exports = server;
