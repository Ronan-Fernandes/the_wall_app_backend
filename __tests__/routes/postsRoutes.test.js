/* eslint-disable no-undef */
const supertest = require("supertest");
const app = require("../../src/server");
const mongoConnection = require("../../src/service/mongoConnection");
const {
  users,
  posts,
  TEST_DATABASE,
  USERS_COLLECTION,
  POSTS_COLLECTION,
} = require("../testData.json");

describe("Posts routes tests", () => {
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

  test("GET /posts should get all the posts", async () => {
    await client.db(TEST_DATABASE).collection(POSTS_COLLECTION).insertMany(posts);

    const response = await supertest(app).get("/posts");

    expect(response.statusCode).toEqual(200);
    expect(response.body.length).toBeGratherThan(0);
    expect(response.body).toStrictEqual(posts);
  });
});
