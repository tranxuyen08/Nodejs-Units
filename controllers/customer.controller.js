const customerService = require("../services/customers.service");

const { handleError } = require("../middlewares/handleError/error");

exports.getAllCustomerController = handleError(async (req, res) => {
    const filters = req.query;
    const customers = await customerService.getAllCustomers(filters);
    res.status(200).send({
        count: customers.length,
        customers,
    });
});

exports.getCustomerByIdController = handleError(async (req, res) => {
    const filters = req.query;
    const { customerNumber } = req.params;
    const customer = await customerService.getCustomerById(customerNumber, filters);
    // Validate response

    res.status(200).send({
        success: true,
        message: "Information a customer by customerNumber",
        data: customer,
    });
});

exports.getInfoCustomerController = handleError(async (req, res) => {
    const { customerNumber } = res.locals.authData;
    const customer = await customerService.getCustomerById(customerNumber);

    res.status(200).send({
        success: true,
        message: "Information of you",
        data: customer,
    });
});

exports.getPaymentController = handleError(async (req, res) => {
    const { customerNumber } = res.locals.authData;
    const payment = await customerService.getPaymentForCustomer(customerNumber);

    res.status(200).send({
        success: true,
        message: "Your payment",
        data: payment,
    });
});

exports.createCustomerController = handleError(async (req, res) => {
    const customer = req.body || {};
    const { employeeNumber: created_by } = res.locals.authData;
    const result = await customerService.createNewCustomer(customer, created_by);
    res.status(201).send({
        success: true,
        message: "Create a new customer successfully",
        customerNumber: result.customerNumber,
    });
});

exports.updateCustomerController = handleError(async (req, res) => {
    const customer = req.body || {};
    const { customerNumber } = req.params;
    const { employeeNumber: updated_by } = res.locals.authData;

    await customerService.updateInfoCustomer(customer, customerNumber, updated_by);

    res.status(200).send({
        success: true,
        message: "Update information successfully",
    });
});

exports.updateCustomerSelfController = handleError(async (req, res) => {
    const customer = req.body || {};
    const { customerNumber } = res.locals.authData;
    await customerService.updateInfoCustomer(customer, customerNumber, customerNumber);

    res.status(200).send({
        success: true,
        message: "Update your information successfully",
    });
});

exports.deleteCustomerController = handleError(async (req, res, next) => {
    const { customerNumber } = req.params;

    await customerService.deleteCustomer(customerNumber);
    res.status(200).send({ success: true, message: "Delete successfully!" });
});
