/* eslint-disable no-undef */
const supertest = require("supertest");
const { ObjectId } = require("mongodb");
const app = require("../../src/server");
const mongoConnection = require("../../src/service/mongoConnection");

const {
  TEST_DATABASE,
  USERS_COLLECTION,
  users,
} = require("../testData.json");

const [user] = users.map((individualUser) => ({
  ...individualUser,
  _id: ObjectId(individualUser._id),
}));

describe("Users routes tests", () => {
  let client;

  beforeAll(async () => {
    client = await mongoConnection();
  });

  afterEach(async () => {
    await client.db(TEST_DATABASE).dropDatabase();
  });

  afterAll(async () => {
    await client.close();
  });

  test("POST /user/register  Create user.", async () => {
    const response = await supertest(app).post("/user/register").send({
      name: user.name,
      email: user.email,
      password: user.password,
      confirm_password: "123456789",
    });

    expect(response.statusCode).toEqual(201);
    expect(response.body.message).toEqual("User registred with success!");
  });

  test("POST /user/register  Create user when user already exists.", async () => {
    await client.db(TEST_DATABASE).collection(USERS_COLLECTION).insertOne({
      ...user, password: user.hash,
    });

    const response = await supertest(app).post("/user/register").send({
      name: user.name,
      email: user.email,
      password: user.password,
      confirm_password: "123456789",
    });

    expect(response.statusCode).toEqual(409);
    expect(response.body.error).toEqual("User already exists!");
  });

  test("POST /user/login", async () => {
    await client.db(TEST_DATABASE).collection(USERS_COLLECTION).insertOne({
      ...user, password: user.hash,
    });

    const response = await supertest(app).post("/user/login").send({
      email: user.email,
      password: user.password,
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.name).toEqual(user.name);
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
    await client.db(TEST_DATABASE).collection(USERS_COLLECTION).insertOne({
      ...user, password: user.hash,
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
    await client.db(TEST_DATABASE).collection(USERS_COLLECTION).insertOne({
      ...user, password: user.hash,
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
