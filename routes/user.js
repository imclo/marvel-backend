const express = require("express");

const router = express.Router();

const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const User = require("../models/User");

router.post("/user/signup", async (req, res) => {
  try {
    // console.log(req.body);

    const password = req.body.password;
    // console.log("password   ", password);
    const salt = uid2(16);
    // console.log("salt   ", salt);
    const hash = SHA256(req.body.password + salt).toString(encBase64);
    // console.log("hash    ", hash);
    const token = uid2(64);
    // console.log("token   ", token);

    const existingUser = await User.find({ email: req.body.email });
    // console.log(existingUser.email);

    // console.log(existingUser);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "email already existed" });
    }

    // console.log(req.body.username);
    if (req.body.username.length === 0) {
      return res.status(400).json({ message: "no username defined" });
    }

    const newUser = new User({
      email: req.body.email,
      account: {
        username: req.body.username,
      },
      token: token,
      hash: hash,
      salt: salt,
    });

    await newUser.save();
    res
      .status(201)
      .json({ id: newUser.id, token: newUser.token, account: newUser.account });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    // console.log(existingUser);

    if (!existingUser) {
      // ou === null
      return res.status(400).json({ message: "email or password incorrect" });
    }

    const hash2 = SHA256(req.body.password + existingUser.salt).toString(
      encBase64
    );

    if (hash2 === existingUser.hash) {
      return res.status(201).json({
        _id: existingUser.id,
        token: existingUser.token,
        account: { username: existingUser.account.username },
      });
    }
    res.status(400).json({ message: "email or password incorrect" });

    // await existingUser.save();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
