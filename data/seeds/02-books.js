/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const bookData = [
  {
    bookname: "Nietzsche Ağladığında",
    author: "Idwing Yaloom",
    user_id: 1,
  },
  {
    bookname: "Sofie'nin Dünyası ",
    author: "Jostein Gaarder",
    user_id: 3,
  },
  {
    bookname: "Nutuk ",
    author: "Mustafa Kemal ATATÜRK",
    user_id: 1,
  },
];

exports.bookData = bookData;
exports.seed = async function (knex) {
  return knex("books").insert(bookData);
};
