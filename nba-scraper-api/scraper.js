const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs-extra");

const URLS = [
  "https://www.teamrankings.com/nba/stat/points-per-game",
  "https://www.teamrankings.com/nba/stat/1st-quarter-points-per-game",
  "https://www.teamrankings.com/nba/stat/2nd-quarter-points-per-game",
  "https://www.teamrankings.com/nba/stat/1st-half-points-per-game",
  "https://www.teamrankings.com/nba/stat/average-scoring-margin",
  "https://www.teamrankings.com/nba/stat/offensive-efficiency",
  "https://www.teamrankings.com/nba/stat/defensive-efficiency"
];

async function scrape() {
  let results = [];

  for (let url of URLS) {
    try {
      const { data } = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      });
      const $ = cheerio.load(data);

      $("table tbody tr").each((i, el) => {
        const team = $(el).find("td").eq(1).text().trim();
        const value = $(el).find("td").eq(2).text().trim();

        if (team && value) {
          results.push({
            team,
            value,
            source: url
          });
        }
      });

    } catch (err) {
      console.log("Error scraping:", url);
    }
  }

  const db = {
    lastUpdate: new Date(),
    stats: results
  };

  await fs.writeJson("./data/database.json", db, { spaces: 2 });

  console.log("Datos actualizados correctamente");
}

scrape();
