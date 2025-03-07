const express = require("express");
const path = require("path");
const axios = require("axios");
require('dotenv').config();

const app = express();
const port = 3000;


app.use(express.static(__dirname));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src/index.html"));
});

app.post("/api/weather", async (req, res) => {
  const { city } = req.body;
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des données météo." });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
