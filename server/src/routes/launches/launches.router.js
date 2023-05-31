const express = require("express");
const { httpGetAllLaunches } = require("./launches.controller");


const launchesRouters = express.Router();

launchesRouters.get("/", httpGetAllLaunches);

module.exports = launchesRouters;