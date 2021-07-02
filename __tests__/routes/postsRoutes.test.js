/* eslint-disable no-undef */
const supertest = require("supertest");
const { ObjectId } = require("mongodb");
const app = require("../../src/server");

const mongoConnection = require("../../src/service/mongoConnection");
const {
  users,
  posts,
  TEST_DATABASE,
  USERS_COLLECTION,
  POSTS_COLLECTION,
} = require("../testData.json");

const postsWithObjectId = posts.map((post) => ({
  ...post,
  _id: ObjectId(post._id),
}));

const usersWithObejectId = users.map((user) => ({
  _id: ObjectId(user._id),
  name: user.name,
  email: user.email,
  password: user.hash,
}));

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

  test("GET /post should get all the posts", async () => {
    await client.db(TEST_DATABASE).collection(POSTS_COLLECTION).insertMany(postsWithObjectId);

    const response = await supertest(app).get("/post");

    expect(response.statusCode).toEqual(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body).toStrictEqual(posts);
  });

  test("POST /post should create a new post", async () => {
    await client.db(TEST_DATABASE).collection(USERS_COLLECTION).insertMany(usersWithObejectId);

    const authResponse = await supertest(app).post("/user/login").send({
      email: users[0].email,
      password: users[0].password,
    });

    const response = await supertest(app).post("/post").send({
      title: posts[0].title,
      content: posts[0].content,
    })
      .set("authorization", authResponse.body.token);

    expect(response.statusCode).toEqual(201);
    expect(response.body.message).toEqual("Post succefully created");
  });

  test("POST /post can't create post without auth", async () => {
    await client.db(TEST_DATABASE).collection(USERS_COLLECTION).insertMany(usersWithObejectId);

    const response = await supertest(app).post("/post").send({
      title: posts.title,
      content: posts.content,
    });
    expect(response.statusCode).toEqual(401);
    expect(response.body.message).toEqual("Unauthorized");
  });

  test("PUT /post/:id should edit his posts", async () => {
    // arrange
    const expectedEditedTitle = "post title edited";
    const expectedEditedContent = "edited post content";

    await client.db(TEST_DATABASE).collection(USERS_COLLECTION).insertMany(usersWithObejectId);
    await client.db(TEST_DATABASE).collection(POSTS_COLLECTION).insertMany(postsWithObjectId);

    const authResponse = await supertest(app).post("/user/login").send({
      email: users[0].email,
      password: users[0].password,
    });

    // act
    await supertest(app).put(`/post/${posts[0]._id}`).send({
      title: expectedEditedTitle,
      content: expectedEditedContent,
    })
      .set("authorization", authResponse.body.token)
      .expect(204);

    const editedPost = await client.db(TEST_DATABASE).collection(POSTS_COLLECTION).findOne({
      _id: ObjectId(posts[0]._id),
    });

    // assert
    expect(editedPost.title).toEqual(expectedEditedTitle);
    expect(editedPost.content).toEqual(expectedEditedContent);
  });

  test("PUT /post/:id should not edit other's users posts", async () => {
    // arrange
    const expectedEditedTitle = "post title edited";
    const expectedEditedContent = "edited post content";

    await client.db(TEST_DATABASE).collection(USERS_COLLECTION).insertMany(usersWithObejectId);
    await client.db(TEST_DATABASE).collection(POSTS_COLLECTION).insertMany(postsWithObjectId);

    const authResponse = await supertest(app).post("/user/login").send({
      email: users[0].email,
      password: users[0].password,
    });

    // act
    const response = await supertest(app).put(`/post/${posts[1]._id}`).send({
      title: expectedEditedTitle,
      content: expectedEditedContent,
    })
      .set("authorization", authResponse.body.token);

    const editedPost = await client.db(TEST_DATABASE).collection(POSTS_COLLECTION).findOne({
      _id: ObjectId(posts[1]._id),
    });

    // assert
    expect(response.statusCode).toEqual(401);
    expect(response.body.message).toEqual("Unauthorized");
    expect(editedPost.title).toEqual(posts[1].title);
    expect(editedPost.content).toEqual(posts[1].content);
  });

  test("DELETE /post/:id user should delete his posts", async () => {
    // arrange
    await client.db(TEST_DATABASE).collection(USERS_COLLECTION).insertMany(usersWithObejectId);
    await client.db(TEST_DATABASE).collection(POSTS_COLLECTION).insertMany(postsWithObjectId);

    const authResponse = await supertest(app).post("/user/login").send({
      email: users[0].email,
      password: users[0].password,
    });

    // act
    await supertest(app).delete(`/post/${posts[0]._id}`)
      .set("authorization", authResponse.body.token)
      .expect(204);

    const editedPost = await client.db(TEST_DATABASE).collection(POSTS_COLLECTION).findOne({
      _id: ObjectId(posts[0]._id),
    });

    console.log("deleteeeeeeeeed", editedPost);
    // assert
    expect(editedPost.title).toEqual();
    expect(editedPost.content).toEqual();
  });

  test("PUT /post/:id should not delete other's users posts", async () => {
    // arrange
    await client.db(TEST_DATABASE).collection(USERS_COLLECTION).insertMany(usersWithObejectId);
    await client.db(TEST_DATABASE).collection(POSTS_COLLECTION).insertMany(postsWithObjectId);

    const authResponse = await supertest(app).post("/user/login").send({
      email: users[0].email,
      password: users[0].password,
    });

    // act
    const response = await supertest(app).delete(`/post/${posts[1]._id}`)
      .set("authorization", authResponse.body.token);

    const editedPost = await client.db(TEST_DATABASE).collection(POSTS_COLLECTION).findOne({
      _id: ObjectId(posts[1]._id),
    });

    // assert
    expect(response.statusCode).toEqual(401);
    expect(response.body.message).toEqual("Unauthorized");
    expect(editedPost.title).toEqual(posts[1].title);
    expect(editedPost.content).toEqual(posts[1].content);
  });
});
