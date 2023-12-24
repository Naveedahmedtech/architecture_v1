// project external files
const express = require('express');
const router = express.Router();

// project files
const orderController = require('../../controllers/orders/orders')

router.post("/create", orderController.createOrders);
router.put("/update", orderController.updateOrder);
router.get("/getOne/:id", orderController.getOneOrder);
router.get("/getAll", orderController.getAllOrders);
router.delete("/deleteOne/:id", orderController.deleteOneOrder);
router.delete("/deleteAll", orderController.deleteAllOrders);


module.exports = router;
