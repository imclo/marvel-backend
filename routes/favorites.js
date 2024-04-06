const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const User = require("../models/User");
const Favorite = require("../models/Favorite");

//Add or delete favorites
router.post("/favorites/handle", isAuthenticated, async (req, res) => {
  //   console.log("route: /favorites/handle");
  //   console.log("req fields : ", req.fields);

  //req.fields format : item and type keys
  const receivedToken = req.headers.authorization.replace("Bearer ", "");
  const userConnected = await User.findOne({ token: receivedToken });
  console.log("target User : ", targetUser);

  try {
    //item type = comic
    if (req.fields.type === "comic") {
      const userConnectedFavComics = userConnected.favorites.favComics;
      //   console.log("comic id in item : ", req.fields.item._id);
      //   console.log("target user favorite comics : ", userConnectedFavComics);

      //Case 1 : favorite doesn't exist
      // -> step 1.1 : push item's _id inside userFavComics array.
      // -> step 1.2 : create a new Favorite document for this comic
      if (!userConnectedFavComics.includes(req.fields.item._id)) {
        // console.log("Add this new favorite to comic list");

        //Step 1.1
        userConnectedFavComics.push(req.fields.item._id);
        await userConnected.save();
        console.log(
          "target User registered ? ",
          userConnectedFavComics.includes(req.fields.item._id)
        );

        //Step 1.2
        const newFavorite = new Favorite({
          comicId: req.fields.item._id,
          title: req.fields.item.title,
          img_url:
            req.fields.item.thumbnail.path +
            "." +
            req.fields.item.thumbnail.extension,
          favType: "comic",
          userId: userConnected.id,
        });
        await newFavorite.save();

        //Send confirmation message : Favorite added.
        res.json({ message: "Favorite comic added." });
      }

      //Case 2 : favorite exists
      // -> step 2.1 : remove item's _id from inside userFavComics array.
      // -> step 2.2 : delete corresponding Favorite document for this comic
      else {
        //Step 2.1
        userConnectedFavComics.splice(
          userConnectedFavComics.indexOf(req.fields.item._id)
        );
        await userConnected.save();
        console.log(
          "Comic id removed from target favComics : ",
          userConnectedFavComics.includes(req.fields.item._id)
        );

        //Step 2.2
        await Favorite.deleteOne({
          comicId: req.fields.item._id,
          userId: userConnected.id,
        });
        console.log("Favorite deleted, go check in Favorite Page.");

        //Send confirmation message : Favorite deleted.
        res.json({ message: "Favorite deleted." });
      }
    }

    //item type = character
    else if (req.fields.type === "character") {
      const userConnectedFavCharacters = userConnected.favorites.favCharacters;
      //   console.log("character id in item : ", req.fields.item._id);
      //   console.log("target user favorite character : ", userConnectedFavCharacters);

      //Case 1 : favorite doesn't exist
      // -> step 1.1 : push item's _id inside userFavCharacters array.
      // -> step 1.2 : create a new Favorite document for this character
      // !! -> key of comicId. have to change name later.
      if (!userConnectedFavCharacters.includes(req.fields.item._id)) {
        console.log("Add this new favorite to comic list");

        //Step 1.1
        userConnectedFavCharacters.push(req.fields.item._id);
        await userConnected.save();
        console.log(
          "target User registered ? ",
          userConnectedFavCharacters.includes(req.fields.item._id)
        );

        //Step 1.2
        const newFavorite = new Favorite({
          comicId: req.fields.item._id,
          title: req.fields.item.name,
          img_url:
            req.fields.item.thumbnail.path +
            "." +
            req.fields.item.thumbnail.extension,
          favType: "character",
          userId: userConnected.id,
        });
        //console.log("favorite character to save : ", newFavorite);
        await newFavorite.save();
        console.log("new favorite character saved : ", newFavorite);
        //Send confirmation message : Favorite added.
        res.json({ message: "Favorite character added." });
      }

      //Case 2 : favorite exists
      // -> step 2.1 : remove item's _id from inside userFavComics array.
      // -> step 2.2 : delete corresponding Favorite document for this comic
      else {
        console.log("Remove this favorite from character list");

        //Step 2.1
        userConnectedFavCharacters.splice(
          userConnectedFavCharacters.indexOf(req.fields.item._id)
        );
        await userConnected.save();
        console.log(
          "Character id removed from target favCharacters : ",
          userConnectedFavCharacters.includes(req.fields.item._id)
        );

        //Step 2.2
        await Favorite.deleteOne({
          comicId: req.fields.item._id,
          userId: userConnected.id,
        });
        console.log("Favorite deleted, go check in Favorite Page.");

        //Send confirmation message : Favorite deleted.
        res.json({ message: "Favorite deleted." });
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Read favorite comics and characters
router.get("/favorites/read", async (req, res) => {
  console.log("route: /favorites/read");
  const receivedToken = req.headers.authorization.replace("Bearer ", "");
  try {
    const userConnected = await User.findOne({ token: receivedToken });
    //valueOf(): returns value of id as a lowercase hexadecimal string
    const userId = userConnected._id.valueOf();
    const userConnectedComics = await Favorite.find({
      favType: "comic",
      userId: userId,
    });
    const userConnectedCharacters = await Favorite.find({
      favType: "character",
      userId: userId,
    });
    res.json({
      message: "favorites have been loaded",
      favComics: userConnectedComics,
      favCharacters: userConnectedCharacters,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

//Remove favorites from favorite page (client side)
router.post("/favorites/remove", isAuthenticated, async (req, res) => {
  //   console.log("route: /favorites/remove");
  const receivedToken = req.headers.authorization.replace("Bearer ", "");
  const userConnected = await User.findOne({ token: receivedToken });

  try {
    //Delete comic Id from user Connected
    //If it is a comic delete comic Id from user Connected favComics. If not delete it from favCharacters.
    if (userConnected.favorites.favComics.includes(req.fields.item.comicId)) {
      userConnected.favorites.favComics.splice(
        userConnected.favorites.favComics.indexOf(req.fields.item.comicId)
      );
    } else if (
      userConnected.favorites.favCharacters.includes(req.fields.item.comicId)
    ) {
      userConnected.favorites.favCharacters.splice(
        userConnected.favorites.favCharacters.indexOf(req.fields.item.comicId)
      );
    }
    await userConnected.save();

    //Delete favorite Document with corresponding userId and comicId
    const userFav = await Favorite.findOne({
      comicId: req.fields.item.comicId,
    });

    if (userFav) await Favorite.deleteOne({ comicId: req.fields.item.comicId });

    res.json({ message: "favorite removed" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
