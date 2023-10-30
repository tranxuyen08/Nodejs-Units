const express = require("express");
const auth = require("../middlewares/auth/auth");
const customerController = require("../controllers/customer.controller");
const { validateCustomer } = require("../middlewares/validators/customer/customer.validator");

const router = express.Router();

//get all customers
router.get(
    "/",
    auth(["President", "Manager", "Leader", "Staff"]),
    validateCustomer,
    customerController.getAllCustomerController,
);

router.get("/myinfo", auth(["Customer"]), customerController.getInfoCustomerController);

router.get(
    "/mypayment",
    auth(["Customer"]),
    validateCustomer,
    customerController.getPaymentController,
);

router.post(
    "/",
    auth(["President", "Manager", "Leader"]),
    validateCustomer,
    customerController.createCustomerController,
);

router.get(
    "/:customerNumber",
    auth(["President", "Manager", "Leader", "Staff"]),
    validateCustomer,
    customerController.getCustomerByIdController,
);

router.put(
    "/profile",
    auth(["Customer"]),
    validateCustomer,
    customerController.updateCustomerSelfController,
);

router.put(
    "/:customerNumber",
    auth(["President", "Manager", "Leader"]),
    validateCustomer,
    customerController.updateCustomerController,
);

router.delete(
    "/:customerNumber",
    auth(["President", "Manager", "Leader"]),
    customerController.deleteCustomerController,
);

module.exports = router;
