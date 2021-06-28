require("dotenv/config");
const { MongoClient } = require("mongodb");

const URL = process.env.MONGO_URL;

let client;
async function mongoConnection() {
  try {
    if (client) {
      return client;
    }

    client = new MongoClient(URL, { useNewUrlParser: true, useUnifiedTopology: true });

    await client.connect();

    return client;
  } catch (error) {
    throw error;
  }
}

module.exports = mongoConnection;
