const { handleError } = require("../middlewares/handleError/error");
const productService = require("../services/product.service");

exports.getAllProductController = handleError(async (req, res) => {
    const filters = req.query;
    const allProduct = await productService.getAllProduct(filters);
    res.status(200).send({
        success: true,
        products: allProduct,
    });
});

exports.getProductByProductCodeController = handleError(async (req, res) => {
    const { productCode } = req.params;
    const product = await productService.getProductByProductCode(productCode);
    res.status(200).send({
        success: true,
        product: product,
    });
});

exports.creatProductController = handleError(async (req, res) => {
    const product = req.body || {};
    const { employeeNumber: created_by } = res.locals.authData;
    const newProduct = await productService.creatProduct(product, created_by);
    res.status(201).send({
        success: true,
        message: "Create successfully new Product",
        productCode: newProduct.productCode,
    });
});

exports.updateProductController = handleError(async (req, res) => {
    const product = req.body || {};
    const { productCode } = req.params;
    const { employeeNumber: updated_by } = res.locals.authData;
    await productService.updateProduct(product, productCode, updated_by);
    res.status(201).send({
        success: true,
        message: "Update successfully!",
    });
});

exports.deleteProductController = handleError(async (req, res) => {
    const { productCode } = req.params;
    await productService.deleteProduct(productCode);
    res.status(201).send({
        success: true,
        message: "Delete successfully!",
    });
});
