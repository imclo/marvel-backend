require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);

const comicsRoutes = require("./routes/comics");
const comicRoutes = require("./routes/comic");
const comicsCharacterRoutes = require("./routes/comics.character");
const charactersRoutes = require("./routes/characters");
const characterRoutes = require("./routes/characterId");
const userRoutes = require("./routes/user");

app.use(comicsRoutes);
app.use(comicRoutes);
app.use(comicsCharacterRoutes);
app.use(charactersRoutes);
app.use(characterRoutes);
app.use(userRoutes);

app.get("/", (req, res) => {
  res.json(201).json({ message: "Welcome to Marvel universe!" });
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "This route does not exist" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
