const express = require("express");
const router = express.Router();

const { createCategory } = require("../controllers/adminController");

router.use((req, res, next) => {
  const { adminKey } = req.body;
  if (adminKey != process.env.ADMIN_KEY) {
    res.status(401).json({ error: "Not Authenticated" });
    return;
  }

  next();
});

router.post("/category", createCategory);

module.exports = router;
