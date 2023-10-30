const moment = require("moment");
const { raw } = require("objection");
const { AppError } = require("../middlewares/handleError/error");
const Customer = require("../models/customer.model");
const Payment = require("../models/payment.model");
const common = require("../utils/common");
const { customerSchema } = require("../middlewares/validators/customer/customer.validator");
const {
    ResArrValidate,
    ResByIDValidate,
} = require("../middlewares/validators/common/common.validator");
const Order = require("../models/orders.model");

const getAllCustomers = async (filters) => {
    const {
        sort_by = "customerNumber",
        sort_type = "asc",
        page_size = 10,
        current_page = 0,
        ...filter
    } = filters;
    const initialQuery = [`SELECT * FROM FA_NODEJS.customers where NOT customerNumber IS NULL`];
    const result = await common.getAllAnyResource(
        initialQuery,
        filter,
        sort_by,
        sort_type,
        page_size,
        current_page,
    );
    await ResArrValidate(customerSchema, result);
    return result;
};

const getCustomerById = async (customerNumber) => {
    await common.checkValidCustomerNumber(customerNumber);
    const customer = await Customer.query().findOne({ customerNumber });
    await ResByIDValidate(customerSchema, customer);
    return customer;
};

const createNewCustomer = async (customer, created_by) => {
    await common.checkValidEmployeeNumber(customer.salesRepEmployeeNumber);
    const newCustomer = await Customer.query().insert({ ...customer, created_by });
    return newCustomer;
};

const updateInfoCustomer = async (customer, customerNumber, updated_by) => {
    await Promise.all([
        common.checkValidCustomerNumber(customerNumber),
        common.checkValidEmployeeNumber(customer.salesRepEmployeeNumber),
    ]);
    const updated_on = moment().format("YYYY-MM-DDTHH:mm:ss");
    const results = await Customer.query()
        .update({ ...customer, updated_by, updated_on })
        .where({ customerNumber });

    return results;
};

const updateMutipleCustomer = async (condition, employeeNumber) => {
    const customer = await Customer.query()
        .select("customerNumber")
        .where({ salesRepEmployeeNumber: employeeNumber });
    const customerNumberArray = customer.map((item) => {
        return item.customerNumber;
    });
    const result = await Customer.query()
        .patch(condition)
        .whereIn("customerNumber", customerNumberArray);
    if (!result) {
        throw new AppError("Can not update customers!", 400);
    }
    return result;
};

const getPaymentForCustomer = async (customerNumber) => {
    let payment = await Payment.query()
        .select("checkNumber", "orders.orderNumber", "paymentDate", "amount", "payments.created_on")

        .from("payments")
        .join("customers", "customers.customerNumber", "payments.customerNumber")
        .join("orders", "orders.customerNumber", "customers.customerNumber")
        .join("orderdetails", "orderdetails.orderNumber", "orders.orderNumber")
        .where("orders.customerNumber", customerNumber)
        .groupBy("customers.customerNumber", "payments.checkNumber");
    const orderNumbers = await Order.query().where({ customerNumber }).select("orderNumber");
    payment = payment.map((item, index) => {
        item.orderNumber = orderNumbers[index].orderNumber;
        return item;
    });
    return payment;
};

const deleteCustomer = async (customerNumber) => {
    await Promise.all([
        common.checkValidCustomerNumber(customerNumber),
        common.checkCustomerRelateToOrder(customerNumber),
    ]);
    const result = await Customer.query().delete().where({
        customerNumber: customerNumber,
    });
    return result;
};

module.exports = {
    getAllCustomers,
    createNewCustomer,
    updateInfoCustomer,
    deleteCustomer,
    getCustomerById,
    updateMutipleCustomer,
    getPaymentForCustomer,
};
