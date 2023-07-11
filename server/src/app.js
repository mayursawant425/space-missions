const express = require("express");
const cors = require("cors");
const morgan = require("morgan")
const v1 = require("./routes/v1")


const app = express();

app.use(cors({
  origin: "http://localhost:3000"
}));
app.use(morgan("combined"));
app.use(express.json());

app.use("/v1", v1);

module.exports = app;