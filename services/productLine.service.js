const moment = require("moment");
const ProductLine = require("../models/productlines.model");
const common = require("../utils/common");
const {
    productLineSchema,
} = require("../middlewares/validators/productLine/productLine.validator");
const commonValidate = require("../middlewares/validators/common/common.validator");

const getAllProductLine = async (filters) => {
    const {
        sort_by = "productLine",
        sort_type = "asc",
        current_page = 0,
        page_size = 10,
        ...filter
    } = filters;

    const initialQuery = [`SELECT * FROM FA_NODEJS.productlines where NOT productLine IS NULL`];

    const result = await common.getAllAnyResource(
        initialQuery,
        filter,
        sort_by,
        sort_type,
        page_size,
        current_page,
    );
    await commonValidate.ResArrValidate(productLineSchema, result);
    return result;
};

const getProductLineByProductLine = async (productLine) => {
    await common.checkValidProductLine(productLine);
    const productline = await ProductLine.query().findOne({ productLine });
    await commonValidate.ResByIDValidate(productLineSchema, productline);
    return productline;
};

const creatProductLine = async (productline, created_by) => {
    await common.checkDuplicateProductLine(productline.productLine);
    const newProduct = await ProductLine.query().insert({ ...productline, created_by });
    return newProduct;
};

const updateProductLine = async (productline, productLine, updated_by) => {
    await common.checkValidProductLine(productLine);
    const updated_on = moment().format("YYYY-MM-DDTHH:mm:ss");

    const updateProduct = await ProductLine.query()
        .update({ ...productline, updated_by, updated_on })
        .where({ productLine });
    return updateProduct;
};

const deleteProductLine = async (productLine) => {
    await common.checkValidProductLine(productLine);
    const result = await ProductLine.query().delete().where({ productLine });
    return result;
};

module.exports = {
    getAllProductLine,
    creatProductLine,
    updateProductLine,
    deleteProductLine,
    getProductLineByProductLine,
};
