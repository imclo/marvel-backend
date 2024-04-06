const express = require("express");
const router = express.Router();

const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const User = require("../models/User");

router.post("/user/signup", async (req, res) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const favoriteCharacters = req.body.favoriteCharacters;
    const favoriteComics = req.body.favoriteComics;

    const salt = uid2(16);
    const hash = SHA256(password + salt).toString(encBase64);
    const token = uid2(16);

    const emailAlreadyExist = await User.find({ email: req.body.email });
    if (emailAlreadyExist[0] !== undefined) {
      return res.status(400).json({ message: "Email already exist" });
    }

    const newUser = new User({
      email: email,
      account: {
        username: username,
        favorites: {
          favCharacters: favoriteCharacters,
          favComics: favoriteComics,
        },
      },
      token: token,
      hash: hash,
      salt: salt,
    });

    await newUser.save();

    res.status(200).json({
      _id: newUser._id,
      token: newUser.token,
      account: newUser.account,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const favoriteCharacters = req.body.favoriteCharacters;
    const favoriteComics = req.body.favoriteComics;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: "Email doesn't exist" });
    }

    // Add a function which adds favorites checked to favorites in database

    const salt = user.salt;
    const hash = SHA256(password + salt).toString(encBase64);
    if (hash === user.hash) {
      res.status(200).json({
        _id: user._id,
        token: user.token,
        account: user.account,
      });
    } else {
      res.status(401).json({ message: "Password doesn't match" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
