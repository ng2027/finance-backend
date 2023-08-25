const express = require("express");
const router = express.Router();

const {
  createTab,
  getSpecificTab,
  updateTab,
  deleteTab,
  getTabs,
} = require("../controllers/tabController");

router.get("/", getTabs);
router.get("/:tabID", getSpecificTab);

router.post("/", createTab);

router.patch("/:tabID", updateTab);

router.delete("/:tabID", deleteTab);

module.exports = router;
