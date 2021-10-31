const express = require("express");
const app = express();
const routes = require("./routes");
const connectDB = require("./config/db");
const path = require("path");
const dotenv = require("dotenv");

const mongoose = require("mongoose");
dotenv.config({ path: "./config/config.env" });

connectDB();

app.use(express.json());
app.use("/api/", routes);

app.listen(5000, () => {
  console.log("App running on PORT 5000");
});
