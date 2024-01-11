const express = require("express");
const router = express.Router();
const orderRouter = require('./orders/orders')
const userRouter = require('./users/users')
const authRouter = require('./auth/auth')

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/orders", orderRouter);

module.exports = router;
