const moment = require("moment");
const Product = require("../models/products.model");
const common = require("../utils/common");
const commonValidate = require("../middlewares/validators/common/common.validator");
const { productSchema } = require("../middlewares/validators/product/product.validator");

const getAllProduct = async (filters) => {
    const {
        sort_by = "productCode",
        sort_type = "asc",
        current_page = 0,
        page_size = 10,
        ...filter
    } = filters;

    const initialQuery = [`SELECT * FROM FA_NODEJS.products where NOT productCode IS NULL`];

    const result = await common.getAllAnyResource(
        initialQuery,
        filter,
        sort_by,
        sort_type,
        page_size,
        current_page,
    );
    await commonValidate.ResArrValidate(productSchema, result);
    return result;
};

const getProductByProductCode = async (productCode) => {
    await common.checkValidProductCode(productCode);
    const product = await Product.query().findOne({ productCode });
    await commonValidate.ResByIDValidate(productSchema, product);
    return product;
};

const creatProduct = async (product, created_by) => {
    await Promise.all([
        common.checkDuplicateProductCode(product.productCode),
        common.checkValidProductLine(product.productLine),
    ]);
    const newProduct = await Product.query().insert({ ...product, created_by });
    return newProduct;
};

const updateProduct = async (product, productCode, updated_by) => {
    await Promise.all([
        common.checkValidProductCode(productCode),
        common.checkValidProductLine(product.productLine),
    ]);
    const updated_on = moment().format("YYYY-MM-DDTHH:mm:ss");
    const productUpdate = await Product.query()
        .update({ ...product, updated_by, updated_on })
        .where({ productCode });
    return productUpdate;
};

const deleteProduct = async (productCode) => {
    await common.checkValidProductCode(productCode);
    const result = await Product.query().delete().where({ productCode });
    return result;
};

module.exports = {
    getAllProduct,
    creatProduct,
    updateProduct,
    deleteProduct,
    getProductByProductCode,
};
