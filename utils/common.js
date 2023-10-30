const bcrypt = require("bcryptjs");
const lodash = require("lodash");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { raw } = require("objection");
const knex = require("knex");
const { development } = require("../knexfile");
const User = require("../models/user.model");
const Employee = require("../models/employee.model");
const Product = require("../models/products.model");
const ProductLine = require("../models/productlines.model");
const Customer = require("../models/customer.model");
const Order = require("../models/orders.model");
const Office = require("../models/office.model");
const UserCustomer = require("../models/usercustomer.model");
const { AppError } = require("../middlewares/handleError/error");

const db = knex(development);

const getUserByUsername = async (type, username) => {
    let user;
    if (type === "User") {
        user = await User.query().findOne({ username }).withGraphFetched("employees");
    } else if (type === "UserCustomer") {
        user = await UserCustomer.query().findOne({ username }).withGraphFetched("customers");
    }

    if (!user) throw new AppError("Could not find username", 404);
    return user;
};

const isPasswordValid = async (password, hashedPassword) => {
    if (typeof password === "number") {
        throw new AppError("Password must be string", 400);
    }
    const isValidPassword = await bcrypt.compare(password, hashedPassword);

    return !!isValidPassword;
};

const generateTokenUser = async (data) => {
    const { employees } = data;
    if (lodash.isEmpty(employees)) {
        throw new AppError("User info is invalid", 400);
    }
    const secret = process.env.TOKEN_SECRET;

    const { employeeNumber, officeCode, jobTitle } = employees;

    const token = jwt.sign({ employeeNumber, officeCode, jobTitle }, secret, {
        expiresIn: 60 * 60,
    });

    return token;
};

const generateTokenUserCustomer = async (data) => {
    const { customers } = data;
    if (lodash.isEmpty(customers)) {
        throw new AppError("User info is invalid", 400);
    }
    const secret = process.env.TOKEN_SECRET;

    const { customerNumber, salesRepEmployeeNumber } = customers;

    const token = jwt.sign(
        { customerNumber, salesRepEmployeeNumber, jobTitle: "Customer" },
        secret,
        {
            expiresIn: 60 * 60,
        },
    );

    return token;
};

const hashPassword = async (password) => {
    if (typeof password === "number" || typeof password === "object") {
        throw new AppError("Password must be string", 400);
    }

    const salt = await bcrypt.genSalt(+process.env.SALT);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
};

const checkDuplicateEmailCreate = async (email) => {
    const isDuplicateEmail = await Employee.query().findOne({ email });

    if (isDuplicateEmail) {
        throw new AppError("Email cannot be dupplicate", 400);
    }
    return isDuplicateEmail;
};

const checkDuplicateEmailUpdate = async (email, employeeNumber) => {
    const isDuplicateEmail = await Employee.query().findOne({ email }).whereNot({ employeeNumber });

    if (isDuplicateEmail) {
        throw new AppError("Email cannot be dupplicate", 400);
    }
    return isDuplicateEmail;
};

const checkDuplicateUserName = async (username, Model) => {
    let isDuplicateUsername;
    if (Model === "User") {
        isDuplicateUsername = await User.query().findOne({ username });
    } else if (Model === "UserCustomer") {
        isDuplicateUsername = await UserCustomer.query().findOne({ username });
    }
    if (isDuplicateUsername) {
        throw new AppError("Username is already exist!", 400, "failed");
    }
    return isDuplicateUsername;
};

const checkDuplicateOfficeCode = async (officeCode) => {
    const isDuplicateOfficeCode = await Office.query().findOne({ officeCode });
    if (isDuplicateOfficeCode) {
        throw new AppError("officeCode cannot be dupplicate", 400);
    }
    return isDuplicateOfficeCode;
};

const checkValidReportsTo = async (reportsTo) => {
    const isValidReportsTo = await Employee.query().where({
        reportsTo,
    });
    if (!isValidReportsTo.length) {
        throw new AppError("ReportsTo is invalid", 400);
    }
    return isValidReportsTo;
};

const checkValidOfficeCode = async (officeCode) => {
    const isValidOfficeCode = await Office.query().findOne({
        officeCode,
    });
    if (!isValidOfficeCode) {
        throw new AppError("OfficeCode is invalid", 400);
    }
    return isValidOfficeCode;
};

const checkValidEmployeeNumber = async (employeeNumber) => {
    const employee = await Employee.query().findOne({ employeeNumber });
    if (!employee) {
        throw new AppError("employeeNumber is invalid", 400);
    }
    return employee;
};

const checkDuplicateUniqueField = async (number, Model) => {
    let data;
    if (Model === "User") {
        data = await User.query().findOne({ employeeNumber: number });
    } else if (Model === "UserCustomer") {
        data = await UserCustomer.query().findOne({ customerNumber: number });
    }
    if (!lodash.isEmpty(data)) {
        throw new AppError("You cannot create more account", 400);
    }
    return data;
};

const getAllAnyResource = async (
    initialQuery,
    filter,
    sort_by,
    sort_type,
    page_size,
    current_page,
) => {
    const arrFilter = Object.keys(filter);

    arrFilter.forEach((item) => {
        initialQuery.push(`AND ${item} LIKE "%${filter[item]}%"`);
    });
    const query = initialQuery.join(" ");
    const result = await db.raw(
        `${query} ORDER BY ${sort_by} IS NULL, ${sort_by} ${sort_type} LIMIT ${page_size} OFFSET ${current_page};`,
    );
    return result[0];
};

const checkCustomerRelateToOrder = async (customerNumber) => {
    const customer = await Order.query().where({ customerNumber });
    if (customer.length) {
        throw new AppError("This customer cannot be delete!", 403);
    }
    return customer;
};

const checkValidCustomerNumber = async (customerNumber) => {
    const customer = await Customer.query().findOne({ customerNumber });
    if (!customer) {
        throw new AppError("customerNumber is invalid", 400);
    }
    return customer;
};

const random8Character = () => {
    const random = uuidv4().split("-")[0].toUpperCase();
    return random;
};

const totalBill = (arrayOrderDetails) => {
    const total = arrayOrderDetails.reduce((acc, item) => {
        const sum = item.quantityOrdered * item.priceEach;
        return sum + acc;
    }, 0);
    return total;
};

const checkChangeFirstNameAndLastName = async (employee, employeeNumber) => {
    const employeeDB = await Employee.query().findOne({ employeeNumber });
    const { lastName, firstName } = employee;

    if (employeeDB.lastName !== lastName || employeeDB.firstName !== firstName) {
        throw new AppError("LastName or FirstName can not change", 400);
    }
    return employeeDB;
};

const checkValidProductCode = async (productCode) => {
    const isProductCode = await Product.query().findOne({ productCode });
    if (!isProductCode) {
        throw new AppError("productCode is invalid!", 404);
    }
    return isProductCode;
};

const checkDuplicateProductCode = async (productCode) => {
    const isProductCode = await Product.query().findOne({ productCode });
    if (isProductCode) {
        throw new AppError("productCode has already exist!", 404);
    }
    return isProductCode;
};

const checkDuplicateProductLine = async (productLine) => {
    const isProductLine = await Product.query().findOne({ productLine });
    if (isProductLine) {
        throw new AppError("productLine has already exist!", 404);
    }
    return isProductLine;
};

const checkValidOrderNumber = async (orderNumber) => {
    const isValidOrderNumber = await Order.query().findOne({ orderNumber, deleted: false });
    if (!isValidOrderNumber) {
        throw new AppError("orderNumber is invalid!", 404);
    }
    return isValidOrderNumber;
};

const checkValidProductLine = async (productLine) => {
    const isProductLine = await ProductLine.query().findOne({ productLine });
    if (!isProductLine) {
        throw new AppError("productLine is invalid!", 404);
    }
    return isProductLine;
};

const getTotalAmountProcess = async (customerNumber) => {
    const orders = await Order.query()
        .where({ customerNumber })
        .whereNotIn("status", ["Shipped", "Cancelled"])
        .withGraphFetched("orderdetails(selectSum)")
        .modifiers({
            selectSum(builder) {
                builder.select().sum(raw("quantityOrdered * priceEach")).groupBy("orderNumber");
            },
        });

    const total = orders.reduce((acc, item) => {
        const sum = item.orderdetails[0]["sum(quantityOrdered * priceEach)"];
        return acc + sum;
    }, 0);

    return total;
};

const getTotalAmount = async (orderNumber) => {
    const orders = await Order.query()
        .findOne({ orderNumber })
        .withGraphFetched("orderdetails(selectSum)")
        .modifiers({
            selectSum(builder) {
                builder.select().sum(raw("quantityOrdered * priceEach")).groupBy("orderNumber");
            },
        });
    const total = orders.orderdetails[0]["sum(quantityOrdered * priceEach)"];
    return total;
};

const getDefaultEmployee = async (officeCode) => {
    const employee = await Employee.query().findOne({
        lastName: "99999",
        officeCode,
    });
    return employee;
};

module.exports = {
    hashPassword,
    isPasswordValid,
    generateTokenUser,
    getUserByUsername,
    generateTokenUserCustomer,
    checkDuplicateEmailCreate,
    checkDuplicateEmailUpdate,
    checkValidReportsTo,
    checkValidOfficeCode,
    checkValidEmployeeNumber,
    checkChangeFirstNameAndLastName,
    checkValidCustomerNumber,
    checkCustomerRelateToOrder,
    checkDuplicateOfficeCode,
    checkValidProductCode,
    checkDuplicateProductCode,
    checkValidProductLine,
    checkDuplicateProductLine,
    random8Character,
    totalBill,
    checkValidOrderNumber,
    getTotalAmountProcess,
    getTotalAmount,
    checkDuplicateUserName,
    checkDuplicateUniqueField,
    getDefaultEmployee,
    getAllAnyResource,
};
