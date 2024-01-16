// project external files
const express = require("express");
const router = express.Router();

// project files
const userController = require("../../controllers/users/users");
const authGuard = require("../../../middleware/authGaurd");

router.get("/get/:id", userController.get);
router.get("/getAll", userController.getAll);
router.patch("/updateProfile", userController.updateProfile);
router.delete("/delete/:id", userController.delete)
router.delete("/deleteAll", userController.deleteAll)

module.exports = router;
