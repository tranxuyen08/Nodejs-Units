const express = require("express");
const auth = require("../middlewares/auth/auth");
const productLineController = require("../controllers/productLine.controller");
const {
    validateProductLine,
} = require("../middlewares/validators/productLine/productLine.validator");

const router = express.Router();

router.get("/", auth(["President"]), productLineController.getAllProductLineController);

router.get(
    "/:productLine",
    auth(["President"]),
    productLineController.getProductLineByProductLineController,
);

router.post(
    "/",
    auth(["President"]),
    validateProductLine,
    productLineController.creatProductLineController,
);

router.put(
    "/:productLine",
    auth(["President"]),
    validateProductLine,
    productLineController.updateProductLineController,
);

router.delete(
    "/:productLine",
    auth(["President"]),
    productLineController.deleteProductLineController,
);

module.exports = router;
