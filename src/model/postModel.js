require("dotenv/config");
const { ObjectId } = require("mongodb");
const mongoConnection = require("../service/mongoConnection");

const DB_NAME = (process.env.NODE_ENV === "test") ? "the_wall_app_tests" : process.env.DB_NAME;
const COLLECTION = "posts";

const findPosts = async (query) => {
  try {
    let mongoQuery;

    if (query && query._id) {
      mongoQuery = {
        ...query,
        _id: ObjectId(query._id),
      };
    } else {
      mongoQuery = { ...query };
    }

    const client = await mongoConnection();
    const response = await client.db(DB_NAME).collection(COLLECTION).find(mongoQuery).toArray();
    return response;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  findPosts,
};
