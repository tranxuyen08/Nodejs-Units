const moment = require("moment");
const Office = require("../models/office.model");
const { officeSchema } = require("../middlewares/validators/office/office.validator");
const common = require("../utils/common");
const commonValidate = require("../middlewares/validators/common/common.validator");

const getAllOffice = async (filters) => {
    const {
        sort_by = "officeCode",
        sort_type = "asc",
        current_page = 0,
        page_size = 10,
        ...filter
    } = filters;
    const initialQuery = [`SELECT * FROM FA_NODEJS.offices where NOT officeCode IS NULL`];
    const result = await common.getAllAnyResource(
        initialQuery,
        filter,
        sort_by,
        sort_type,
        page_size,
        current_page,
    );
    await commonValidate.ResArrValidate(officeSchema, result);
    return result;
};

const getOfficeByOfficeCode = async (officeCode) => {
    await common.checkValidOfficeCode(officeCode);
    const office = await Office.query().findOne({ officeCode });
    await commonValidate.ResByIDValidate(officeSchema, office);
    return office;
};

const createOffice = async (office, created_by) => {
    await common.checkDuplicateOfficeCode(office.officeCode);
    const newOffice = await Office.query().insert({ ...office, created_by });
    return newOffice;
};

const updateOffice = async (office, officeCode, updated_by) => {
    await common.checkValidOfficeCode(officeCode);
    const updated_on = moment().format("YYYY-MM-DDTHH:mm:ss");
    const newOffice = await Office.query()
        .update({ ...office, updated_by, updated_on })
        .where({ officeCode });
    return newOffice;
};

const deleteOffice = async (officeCode) => {
    await common.checkValidOfficeCode(officeCode);
    const result = await Office.query().delete().where({ officeCode });
    return result;
};

module.exports = {
    getAllOffice,
    createOffice,
    updateOffice,
    deleteOffice,
    getOfficeByOfficeCode,
};
