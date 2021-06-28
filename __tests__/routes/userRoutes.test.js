/* eslint-disable no-undef */
const supertest = require("supertest");
const app = require("../../src/server");
const mongoConnection = require("../../src/service/mongoConnection");

const TEST_DATABASE = "the_wall_app_tests";
const COLLECTION = "users";
const user = {
  name: "user name",
  email: "email@email.com",
  password: "123456789",
};

const userHash = "$2a$10$q3C9I2uWtkdyNXaIdm.1nO9hP5EkmREF0nApQWO6irY6XboOg1rTy";

describe("User route tests", () => {
  let client;

  beforeAll(async () => {
    client = await mongoConnection();
    dataBaseUsersCollection = await client.db(TEST_DATABASE).collection(COLLECTION);
  });

  afterEach(async () => {
    await client.db(TEST_DATABASE).dropDatabase();
  });

  afterAll(async () => {
    await client.close();
  });

  test("POST /user/register  Create user.", async () => {
    const response = await supertest(app).post("/user/register").send({ ...user, confirm_password: "123456789" });

    expect(response.statusCode).toEqual(201);
    expect(response.body.message).toEqual("User registred with success!");
  });

  test("POST /user/register  Create user when user already exists.", async () => {
    await client.db(TEST_DATABASE).collection(COLLECTION).insertOne({
      ...user, password: userHash,
    });

    const response = await supertest(app).post("/user/register").send({ ...user, confirm_password: "123456789" });

    expect(response.statusCode).toEqual(409);
    expect(response.body.error).toEqual("User already exists!");
  });

  test("POST /user/login", async () => {
    const createdUser = await client.db(TEST_DATABASE).collection(COLLECTION).insertOne({
      ...user, password: userHash,
    });

    const response = await supertest(app).post("/user/login").send({
      email: user.email,
      password: user.password,
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.name).toEqual(createdUser.ops[0].name);
  });

  test("POST /user/login when user does not exist.", async () => {
    const response = await supertest(app).post("/user/login").send({
      email: user.email,
      password: user.password,
    });

    expect(response.statusCode).toEqual(401);
    expect(response.body.token).not.toBeDefined();
    expect(response.body.message).toEqual("Unauthorized, wrong email or password");
  });

  test("POST /user/login when password is wrong", async () => {
    await client.db(TEST_DATABASE).collection(COLLECTION).insertOne({
      ...user, password: userHash,
    });

    const response = await supertest(app).post("/user/login").send({
      email: user.email,
      password: `${user.password}1`,
    });

    expect(response.statusCode).toEqual(401);
    expect(response.body.token).not.toBeDefined();
    expect(response.body.message).toEqual("Unauthorized, wrong email or password");
  });

  test("POST /user/login when email is wrong", async () => {
    await client.db(TEST_DATABASE).collection(COLLECTION).insertOne({
      ...user, password: userHash,
    });

    const response = await supertest(app).post("/user/login").send({
      email: `a${user.email}`,
      password: user.password,
    });

    expect(response.statusCode).toEqual(401);
    expect(response.body.token).not.toBeDefined();
    expect(response.body.message).toEqual("Unauthorized, wrong email or password");
  });
});
