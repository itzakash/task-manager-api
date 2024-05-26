const express = require("express");
require("../db/mongoose");
const Users = require("../models/user");
const multer = require("multer");
const sharp = require("sharp");
// const { sendWelcomeEmail, userCancelEmail } = require('../emails/account');
const auth = require("../middleware/auth");
const router = new express.Router();

//create new user

router.post("/users", async (req, res) => {
  const user = new Users(req.body);

  try {
    await user.save();
    // sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();

    res.status(200).send({ user, token });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

// Fetching the all users

router.get("/users", auth, async (req, res) => {
  try {
    const users = await Users.find();

    if (users.length == 0) {
      res.status(404).send();
    }

    res.status(201).send(users);
  } catch (e) {
    res.status(500).send(e);
  }
});

// Fetch User Profile

router.get("/users/profile", auth, async (req, res) => {
  try {
    res.status(201).send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

// Get single records

// router.get('/users/:id', async (req, res) => {
//   try {
//     const user = await Users.findOne({ _id: req.params.id });

//     if (!user) return res.status(404).send();

//     res.status(201).send(user);
//   } catch (e) {
//     res.status(500).send(e);
//   }
// });

//Update the user

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedBody = ["name", "email", "password", "age"];

  const isValidator = updates.every((update) => allowedBody.includes(update));

  if (!isValidator) {
    return res.status(400).send({ error: "Invalida Updates!" });
  }
  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));

    await req.user.save();

    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// delete the user

// router.delete('/users/:id', async (req, res) => {
//   try {
//     const user = await Users.findByIdAndDelete(req.params.id);

//     if (!user) {
//       return res.status(404).send();
//     }

//     res.send(user);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

//delete the account from current logged user

router.delete("/users/me", auth, async (req, res) => {
  try {
    // Old Wayy
    // const user = await Users.findByIdAndDelete(req.user._id);
    await req.user.remove(); //new Way
    // userCancelEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (error) {
    res.status(400).send();
  }
});
//login user

router.post("/users/login", async (req, res) => {
  try {
    const user = await Users.findBycredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res.status(401).send();
  }
});

//logout user

router.post("/users/logout", auth, async (req, res) => {
  try {
    // console.log(req.user);
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
      // console.log(token);
    });

    await req.user.save();
    res.send();
  } catch (error) {
    re.status(400).send(error);
  }
});

//logout form all device

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(400).send();
  }
});

/*
  Set Avatar to users
*/
const upload = multer({
  // dest: 'images/avatars',
  limits: {
    fileSize: 8000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload the jpg,jpeg and png files"));
    }

    cb(undefined, true);
  },
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    // With out resize
    // req.user.avatar = req.file.buffer;

    const buffer = await sharp(req.file.buffer).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();

    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send();
  }
});

module.exports = router;
