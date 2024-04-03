const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/comics", async (req, res) => {
  try {
    // console.log(req.query);
    const { page, title } = req.query;

    //pagination condition
    let limit = 100;
    let pageToSend = 1;
    if (page) {
      pageToSend = page;
    }

    let skip = (pageToSend - 1) * limit;

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?limit=${limit}&skip=${skip}&apiKey=${process.env.API_KEY}&title=${title}`
    );
    // console.log(response.data);
    res.status(201).json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
