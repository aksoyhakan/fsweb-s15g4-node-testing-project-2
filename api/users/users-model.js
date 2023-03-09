const db = require("../../data/db-config");

async function adjustInfo() {
  const users = await db("users");
  const books = await db("users as u")
    .leftJoin("books as b", "u.user_id", "b.user_id")
    .select("u.*", "b.bookname");
  let newArray = users.map((user) => {
    let bookArray = [];
    books.forEach((book) => {
      book.user_id === user.user_id && bookArray.push(book.bookname);
    });

    let newObj = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      books: bookArray[0] ? bookArray : [],
    };
    return newObj;
  });
  return newArray;
}

async function getAll() {
  return await adjustInfo();
}

async function getById(user_id) {
  const allData = await adjustInfo();
  let selectedUser = allData.filter(
    (data) => data.user_id === Number(user_id)
  )[0];

  return selectedUser;
}

function register(user) {
  console.log(user);
  let insertedUser = db("users")
    .insert(user)
    .then((response) => {
      return getById(response[0]);
    });

  return insertedUser;
}

module.exports = { getAll, getById, register };
