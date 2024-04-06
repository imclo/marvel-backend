const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewars/isAuthenticated");
const User = require("../models/User");

router.post("/favorites", isAuthenticated, async (req, res) => {
  try {
    res.status(201).json({ message: "Added" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
