const express = require("express");
const router = express.Router();

const {
  signUpUser,
  loginUser,
  verifyUser,
} = require("../controllers/userController");

// login route
router.post("/login", loginUser);

// signup route
router.post("/signup", signUpUser);

router.get("/verify", verifyUser);

module.exports = router;
