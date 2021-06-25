require("dotenv/config");
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());

app.use(bodyParser.json({
  limit: "10mb"
}));

app.use(bodyParser.urlencoded({
  extended: false,
}));

module.exports = app;
