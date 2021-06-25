const app = require('../../src/server');
const mongoConnection = require('../../src/service/mongoConnection');
const supertest = require('supertest');

const TEST_DATABASE = 'the_wall_app_tests';
const COLLECTION = 'users';
const user = {
  name: "Ronan Fernandes",
  email: "email@email.com",
  password: "123456789"
}


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

  test("POST /user  Create user.", async () => {

    const response = await supertest(app).post('/user').send(user);

    expect(response.statusCode).toEqual(201)
    expect(response.message).toEqual("User registred with success!");
  });

});
