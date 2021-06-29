require("dotenv/config");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();
app.use(cors());

app.use(bodyParser.json({
  limit: "10mb",
}));

app.use(bodyParser.urlencoded({
  extended: false,
}));

app.use("/user", userRoutes);
app.use("/post", postRoutes);

module.exports = app;
