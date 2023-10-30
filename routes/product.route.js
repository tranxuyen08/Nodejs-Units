const express = require("express");
const auth = require("../middlewares/auth/auth");
const productController = require("../controllers/product.controller");
const { validateProduct } = require("../middlewares/validators/product/product.validator");

const router = express.Router();

router.get(
    "/",
    auth(["President", "Manager", "Leader", "Staff"]),
    productController.getAllProductController,
);

router.get(
    "/:productCode",
    auth(["President", "Manager", "Leader", "Staff"]),
    productController.getProductByProductCodeController,
);

router.post(
    "/",
    auth(["President", "Manager", "Leader", "Staff"]),
    validateProduct,
    productController.creatProductController,
);

router.put(
    "/:productCode",
    auth(["President", "Manager", "Leader", "Staff"]),
    validateProduct,
    productController.updateProductController,
);

router.delete(
    "/:productCode",
    auth(["President", "Manager", "Leader", "Staff"]),
    productController.deleteProductController,
);

module.exports = router;
