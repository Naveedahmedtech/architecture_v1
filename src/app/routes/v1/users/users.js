// project external files
const express = require("express");
const router = express.Router();

// project files
const userController = require("../../../controllers/v1/users/users");
const authGuard = require("../../../../middleware/authGaurd");

router.patch("/update",  userController.update);
router.get("/get/:id", userController.get);
router.get("/getAll", userController.getAll);
// router.get("/getAll", authGuard, userController.getAll);
// router.get("/getAll", authGuard, userController.getAll);

module.exports = router;
