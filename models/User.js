const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: String,
  account: {
    username: String,
    favorites: {
      favComics: Array,
      favCharacters: Array,
    },
  },
  token: String,
  hash: String,
  salt: String,
});

module.exports = User;
