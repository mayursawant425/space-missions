const express = require("express");
const {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch
} = require("./launches.controller");


const launchesRouters = express.Router();

launchesRouters.get("/", httpGetAllLaunches);
launchesRouters.post("/", httpAddNewLaunch);
launchesRouters.delete("/:id", httpAbortLaunch);

module.exports = launchesRouters;