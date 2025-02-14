const express = require("express");
const path = require("path");
require('dotenv').config();

const app = express();
const port = 3000;

const apiKey = process.env.API_KEY;

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src/index.html"));
});

app.get("/api", (req, res) => {
  res.json({ key: apiKey });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
