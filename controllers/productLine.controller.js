const { handleError } = require("../middlewares/handleError/error");
const productLineService = require("../services/productLine.service");

exports.getAllProductLineController = handleError(async (req, res) => {
    const filters = req.query;
    const productLines = await productLineService.getAllProductLine(filters);
    res.status(200).send({
        success: true,
        productLines,
    });
});

exports.getProductLineByProductLineController = handleError(async (req, res) => {
    const { productLine } = req.params;
    const productline = await productLineService.getProductLineByProductLine(productLine);
    res.status(200).send({
        success: true,
        productLine: productline,
    });
});

exports.creatProductLineController = handleError(async (req, res) => {
    const productline = req.body || {};
    const { employeeNumber: created_by } = res.locals.authData;
    const newProduct = await productLineService.creatProductLine(productline, created_by);
    res.status(201).send({
        success: true,
        message: "Create successfully new Product",
        productLine: newProduct.productLine,
    });
});

exports.updateProductLineController = handleError(async (req, res) => {
    const productline = req.body || {};
    const { productLine } = req.params;
    const { employeeNumber: updated_by } = res.locals.authData;
    await productLineService.updateProductLine(productline, productLine, updated_by);
    res.status(200).send({
        success: true,
        message: "Update successfully!",
    });
});

exports.deleteProductLineController = handleError(async (req, res) => {
    const { productLine } = req.params;
    await productLineService.deleteProductLine(productLine);
    res.status(200).send({
        success: true,
        message: "Delete successfully!",
    });
});
