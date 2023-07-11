const express = require("express")
const planetsRouter = require("./planets/planets.router");
const launchesRouters = require("./launches/launches.router");


const v1 = express.Router();

v1.use("/planets", planetsRouter);
v1.use("/launches", launchesRouters);

module.exports = v1;