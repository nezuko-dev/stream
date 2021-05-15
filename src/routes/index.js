const express = require("express");
const router = express.Router();

// middleware
const token = require("../middleware/token");

router.get("/", (req, res) => res.send("🍿"));
router.use("/account", require("./account"));
module.exports = router;
