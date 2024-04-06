const mongoose = require("mongoose");

const Favorite = mongoose.model("Favorite", {
  comicId: String,
  title: String,
  img_url: String,
  favType: String,
  userId: String,
});

module.exports = Favorite;
