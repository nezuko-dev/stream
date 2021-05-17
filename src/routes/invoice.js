const express = require("express");
const router = express.Router();
const invoice = require("../controllers/invoice");
// middleware

/**
 * /api/invoice:
 */
router.get("/", invoice.index);
router.post("/monpay", invoice.monpay);

module.exports = router;
