const request = require("supertest");
const server = require("./server");
const db = require("../data/db-config");
const UserModels = require("./users/users-model");
const bcrypt = require("bcryptjs");

test("test environment testing olarak ayarlanmış", () => {
  expect(process.env.NODE_ENV).toBe("testing");
});

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db.seed.run();
});

describe("/auth/login doğru çalışıyor", () => {
  test("[1] doğru veri gönderince doğru mesaj alıyor", async () => {
    const input = { username: "aksoyhak", password: "Deneme+11" };
    const res = await request(server).post("/api/auth/login").send(input);
    expect(res.body.message).toBe("Welcome aksoyhak");
    expect(res.status).toBe(200);
  });
  test("[2] olmayan username verildiğinde doğru hata mesajı alınıyor", async () => {
    const input = { username: "talat", password: "Deneme+11" };
    const res = await request(server).post("/api/auth/login").send(input);
    expect(res.body.message).toBe("user not found");
    expect(res.status).toBe(404);
  });
  test("[3] doğru username yanlış şifrede doğru mesaj alıyor", async () => {
    const input = { username: "aksoyhak", password: "Deneme+12" };
    const res = await request(server).post("/api/auth/login").send(input);
    expect(res.body.message).toBe("invalid data");
    expect(res.status).toBe(404);
  });
});

describe("users-modelleri", () => {
  test("[4] users getAll fonksiyonu doğru çalışıyor", async () => {
    const actual = await UserModels.getAll();
    const expected = 3;
    expect(actual.length).toBe(expected);
    expect(actual[actual.length - 1].username).toBe("kabat");
  });
  test("[5] users getById fonksiyonu doğru çalışıyor", async () => {
    const actual = await UserModels.getById(1);
    const expected = {
      user_id: 1,
      username: "aksoyhak",
      email: "aksoyhak@itu.edu.tr",
      books: ["Nietzsche Ağladığında", "Nutuk "],
    };
    expect(actual).toEqual(expected);
  });
  test("[6] users register fonksiyonu doğru çalışıyor", async () => {
    const input = {
      username: "hakan",
      email: "aksoyhak@itu.edu.tr",
      institute: "ITU",
      password: "Deneme+11",
      role: "student",
    };
    const actual = await UserModels.register(input);
    const expected = {
      user_id: 4,
      username: "hakan",
      email: "aksoyhak@itu.edu.tr",
      books: [],
    };
    expect(actual).toEqual(expected);
  });
  describe("user route-middleware", () => {
    test("[7] user post doğru verileri kaydediyor", async () => {
      const input = {
        username: "hakan",
        email: "aksoyhak@itu.edu.tr",
        institute: "ITU",
        password: "Deneme+11",
        role: "student",
      };
      const expected = {
        user_id: 4,
        username: "hakan",
        email: "aksoyhak@itu.edu.tr",
        books: [],
      };
      const res = await request(server).post("/api/users").send(input);
      expect(res.status).toBe(201);
      expect(res.body).toEqual(expected);
    });
    test("[8] user post eksik verileri doğru hata mesajı veriyor", async () => {
      const input = {
        email: "aksoyhak@itu.edu.tr",
        institute: "ITU",
        password: "Deneme+11",
        role: "student",
      };
      const expected = {
        message: `username property is missing`,
      };
      const res = await request(server).post("/api/users").send(input);
      expect(res.status).toBe(401);
      expect(res.body).toEqual(expected);
      const input2 = {
        username: "hakan",

        institute: "ITU",
        password: "Deneme+11",
        role: "student",
      };
      const expected2 = {
        message: `email property is missing`,
      };
      const res2 = await request(server).post("/api/users").send(input);
      expect(res2.status).toBe(401);
      expect(res2.body).toEqual(expected);
    });
    test("[9] şifre kriptolanıyor", async () => {
      const input = {
        username: "hakan",
        email: "aksoyhak@itu.edu.tr",
        institute: "ITU",
        password: "Deneme+11",
        role: "student",
      };
      const res = await request(server).post("/api/users").send(input);
      const newUser = await db("users").where("user_id", res.body.user_id);
      expect(newUser.password).not.toBe(input.password);
    });
  });
});
