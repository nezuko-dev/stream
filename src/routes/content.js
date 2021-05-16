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
router.get("/titles/:id", token, content.titles);

module.exports = router;
