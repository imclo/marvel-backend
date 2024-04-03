const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/characters", async (req, res) => {
  try {
    // console.log(req.query);
    const { limit = "", name = "", skip = "" } = req.query;

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.API_KEY}&limit=${limit}&name=${name}&skip=${skip}`
      //   `https://lereacteur-marvel-api.herokuapp.com/characters?limit=${limit}&skip=${skip}&apiKey=${process.env.API_KEY}&name=${name}`
    );
    // console.log(response.data);
    res.status(201).json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
