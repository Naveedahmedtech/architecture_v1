// project external files
const express = require("express");
const router = express.Router();

// project files
const apiKeyController = require("../../../controllers/v1/universal/api_keys");

router.post("/api_keys/add", apiKeyController.add);
router.patch("/api_keys/update", apiKeyController.update);
router.get("/api_keys/get/:id", apiKeyController.get);
router.get("/api_keys/getAll", apiKeyController.getAll);
router.delete("/api_keys/delete", apiKeyController.delete);
router.delete("/api_keys/deleteAll", apiKeyController.deleteAll);

module.exports = router;
