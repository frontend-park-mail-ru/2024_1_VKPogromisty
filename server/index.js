const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT;

app.use("*/static", express.static(path.resolve(__dirname, "..", "static")));
app.use("*/public", express.static(path.resolve(__dirname, "..", "public")));
app.use("*/dist", express.static(path.resolve(__dirname, "..", "dist")));
app.use(
  "*/handlebars",
  express.static(path.resolve(__dirname, "..", "handlebars")),
);

app.get("/sw.js", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "dist", "sw.js"));
});

app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "dist", "index.html"));
});

app.listen(PORT, () => {});
