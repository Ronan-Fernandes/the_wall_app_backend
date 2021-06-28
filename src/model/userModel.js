require("dotenv/config");
const mongoConnection = require("../service/mongoConnection");

const DB_NAME = (process.env.NODE_ENV === "test") ? "the_wall_app_tests" : process.env.DB_NAME;
const COLLECTION = "users";

const createNewUser = async (userData) => {
  try {
    const client = await mongoConnection();
    await client.db(DB_NAME).collection(COLLECTION).insertOne(userData);
  } catch (error) {
    throw error;
  }
};

const findUser = async (query) => {
  try {
    const client = await mongoConnection();
    return await client.db(DB_NAME).collection(COLLECTION).findOne(query);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createNewUser,
  findUser,
};
