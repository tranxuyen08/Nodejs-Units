const express = require("express");
const auth = require("../middlewares/auth/auth");
const orderController = require("../controllers/order.controller");
const {
    validateOrder,
    validateOrderUpdate,
} = require("../middlewares/validators/order/order.validator");

const router = express.Router();

router.get(
    "/",
    auth(["President", "Manager", "Leader", "Staff"]),
    validateOrder,
    orderController.getAllOrderController,
);

router.get("/myorder", auth(["Customer"]), orderController.getOrderForCustomerController);

router.get(
    "/:orderNumber",
    auth(["President", "Manager", "Leader", "Staff"]),
    validateOrder,
    orderController.getOrderByOrderNumberController,
);

router.post(
    "/",
    auth(["President", "Manager", "Leader", "Customer"]),
    validateOrder,
    orderController.createNewOrderController,
);

router.patch(
    "/:orderNumber",
    auth(["President", "Manager", "Leader", "Customer"]),
    validateOrderUpdate,
    orderController.updateOrderController,
);

router.delete(
    "/:orderNumber",
    auth(["President", "Manager", "Leader"]),
    orderController.deleteOrderController,
);

module.exports = router;
