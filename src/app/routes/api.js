const express = require("express");
const router = express.Router();
const orderRouter = require('./orders/orders')

router.use("/orders", orderRouter);

module.exports = router;
