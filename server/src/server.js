const http = require("http");
const app = require("./app");
const { loadPlanetsData } = require("./models/planets.model")


const PORT = process.env.PORT || 3001;
const server = http.createServer(app);

async function startUp() {
  await loadPlanetsData();
  server.listen(PORT, () => {
    console.log(PORT);
  });
}

startUp();