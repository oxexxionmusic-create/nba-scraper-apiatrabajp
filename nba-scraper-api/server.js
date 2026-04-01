const express = require("express");
const fs = require("fs-extra");
const cron = require("node-cron");
const { exec } = require("child_process");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("NBA API funcionando");
});

app.get("/data", async (req, res) => {
  try {
    const data = await fs.readJson("./data/database.json");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "No se pudieron leer los datos" });
  }
});

// Ejecutar scraping todos los días a las 6 AM
cron.schedule("0 6 * * *", () => {
  console.log("Ejecutando scraping automático...");
  exec("node scraper.js");
});

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});
