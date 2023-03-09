/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const userData = [
  {
    username: "aksoyhak",
    institute: "ITU",
    email: "aksoyhak@itu.edu.tr",
    password: "$2a$08$8P/HH7ZoZmGAYB.2LjcWt.FrRNI3w.eNt4n2XKqYn2hzBNwnZLKY.",
    role: "admin",
  },
  {
    username: "yontarm",
    institute: "YTU",
    email: "yontarm@ytu.edu.tr",
    password: "Deneme+12",
    role: "student",
  },
  {
    username: "kabat",
    institute: "ODTU",
    email: "tkaba@odtu.edu.tr",
    password: "Deneme+13",
  },
];

exports.userData = userData;
exports.seed = async function (knex) {
  return knex("users").insert(userData);
};
