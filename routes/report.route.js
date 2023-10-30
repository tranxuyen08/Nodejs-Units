const express = require("express");
const auth = require("../middlewares/auth/auth");
const reportController = require("../controllers/report.controller");

const router = express.Router();

router.get("/", auth(["President"]), reportController.revenueByOffice);

router.get("/customers", auth(["President"]), reportController.revenueByCustomers);

router.get("/productline/:officeCode", auth(["President"]), reportController.revenueByProductLine);

module.exports = router;
