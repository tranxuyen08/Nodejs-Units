const { handleError } = require("../middlewares/handleError/error");
const officeService = require("../services/office.service");

exports.getAllOffice = handleError(async (req, res) => {
    const filters = req.query;
    const offices = await officeService.getAllOffice(filters);
    res.status(200).send({
        success: true,
        offices: offices,
    });
});

exports.getOfficeByOfficeCode = handleError(async (req, res) => {
    const { officeCode } = req.params;
    const office = await officeService.getOfficeByOfficeCode(officeCode);
    res.status(200).send({
        success: true,
        office: office,
    });
});

exports.createOfficeController = handleError(async (req, res) => {
    const office = req.body || {};
    const { employeeNumber: created_by } = res.locals.authData;
    const newOffice = await officeService.createOffice(office, created_by);
    res.status(201).send({
        success: true,
        message: "Create successfully new office",
        officeCode: newOffice.officeCode,
    });
});

exports.updateOfficeController = handleError(async (req, res) => {
    const office = req.body || {};
    const { officeCode } = req.params;
    const { employeeNumber: updated_by } = res.locals.authData;
    await officeService.updateOffice(office, officeCode, updated_by);
    res.status(200).send({
        success: true,
        message: "Update successfully!",
    });
});

exports.deleteOfficeController = handleError(async (req, res) => {
    const { officeCode } = req.params;
    await officeService.deleteOffice(officeCode);
    res.status(201).send({
        success: true,
        message: "Delete successfully!",
    });
});
