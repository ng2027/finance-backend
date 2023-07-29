const express = require("express");
const router = express.Router();

const {
  signUpUser,
  loginUser,
  verifyUser,
} = require("../controllers/userController");

router.get("/", (req, res) => {
  res.json({ msg: "GET USER FROM JWT" });
});

// login route
router.post("/login", loginUser);

// signup route
router.post("/signup", signUpUser);

router.get("/verify", verifyUser);

module.exports = router;
