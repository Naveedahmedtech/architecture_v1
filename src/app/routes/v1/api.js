const express = require("express");
const router = express.Router();
const userRouter = require('./users/users')
const authRouter = require('./auth/auth')
const universalRouter = require('./universal/api_keys')


router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/universal", universalRouter);

module.exports = router;
