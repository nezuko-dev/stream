const express = require("express");
const router = express.Router();

// middleware
const token = require("../middleware/token");

router.get("/", (req, res) => res.send("🍿"));
router.use("/account", require("./account"));
router.use("/content", require("./content"));
router.use("/invoice", token, require("./invoice"));
module.exports = router;
