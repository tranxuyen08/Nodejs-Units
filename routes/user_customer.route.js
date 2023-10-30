const express = require("express");
const {
    validateUserCustomer,
} = require("../middlewares/validators/user_customer/user_customer.validator");
const userCustomerController = require("../controllers/user_customer.controller");

const router = express.Router();

router.post("/register", validateUserCustomer, userCustomerController.registerForUserCustomer);

router.post("/login", userCustomerController.loginForUserCustomer);

module.exports = router;
