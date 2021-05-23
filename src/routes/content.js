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
router.get("/title/:id/:episode", token, content.stream);
router.get("/titles/:id", token, content.titles);
router.get("/browse", content.browse);

module.exports = router;
