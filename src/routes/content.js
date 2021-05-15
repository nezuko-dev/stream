const express = require("express");
const router = express.Router();
const content = require("../controllers/content");
// middleware
const token = require("../middleware/token");
const validator = require("../middleware/validator");
/**
 * /api/content:
 */
router.get("/", content.index);

module.exports = router;
