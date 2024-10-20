import express from "express";
import cors from "cors";
import router from "./routes/pokemons.routes";

const app = express();
const bodyParser = require("express").json;

app.use(cors());
app.use(bodyParser());
app.use("/api", router);

module.exports = app;
