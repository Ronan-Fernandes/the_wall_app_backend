require("dotenv/config");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();
app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use("/user", userRoutes);
app.use("/post", postRoutes);

module.exports = app;
