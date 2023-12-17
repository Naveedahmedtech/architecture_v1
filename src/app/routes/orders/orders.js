// project external files
const express = require('express');
const router = express.Router();

// project files
const orderController = require('../../controllers/orders/orders')

router.get("/allOrders", orderController.getDetailedOrders);
router.get("/getAllOrders", orderController.getAllOrders);
router.get("/getOne/:id", orderController.getOneOrder);
router.get("/deleteOne/:id", orderController.deleteOneOrder);
router.get("/deleteAll", orderController.deleteAllOrders);
router.post("/create", orderController.createOrders);
router.put("/update", orderController.updateOrder);


module.exports = router;
