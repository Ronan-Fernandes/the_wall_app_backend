require('dotenv/config');
const mongoConnection = require('../service/mongoConnection');

const DB_NAME = process.env.DB_NAME;
const COLLECTION = "users";

const createNewUser = async (userData) => {
  try {
    const client = await mongoConnection();
    await client.db(DB_NAME).collection(COLLECTION).insertOne(userData);
    
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createNewUser
}