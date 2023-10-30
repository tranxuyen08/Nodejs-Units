const express = require("express");
const auth = require("../middlewares/auth/auth");
const officeController = require("../controllers/office.controller");
const { validateOffice } = require("../middlewares/validators/office/office.validator");

const router = express.Router();

router.post("/", auth(["President"]), validateOffice, officeController.createOfficeController);

router.get("/", auth(["President"]), validateOffice, officeController.getAllOffice);

router.get("/:officeCode", auth(["President"]), officeController.getOfficeByOfficeCode);

router.put(
    "/:officeCode",
    auth(["President"]),
    validateOffice,
    officeController.updateOfficeController,
);

router.delete("/:officeCode", auth(["President"]), officeController.deleteOfficeController);

module.exports = router;
