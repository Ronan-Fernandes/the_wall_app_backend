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


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`app running on port ${port}`));