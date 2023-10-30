const moment = require("moment");
const { raw } = require("objection");
const Order = require("../models/orders.model");
const Office = require("../models/office.model");
const Employee = require("../models/employee.model");
const { AppError } = require("../middlewares/handleError/error");
const common = require("../utils/common");

const getRevenueByOfficeInRangeTime = async (
    start_date,
    end_date = moment().format("YYYY-MM-DD"),
) => {
    if (start_date >= end_date) {
        throw new AppError("start_date must be less than end_date");
    }
    if (!start_date) {
        const minOrderDate = await Order.query().min("orderDate as minOrder");
        start_date = minOrderDate[0].minOrder;
    }
    const rawData = await Office.query()
        .select(
            raw(
                "sum(orderdetails.quantityOrdered * orderdetails.priceEach) as revenue, offices.officeCode",
            ),
        )
        .from("offices")
        .join("employees", "employees.officeCode", "offices.officeCode")
        .join("customers", "customers.salesRepEmployeeNumber", "employees.employeeNumber")
        .join("orders", "orders.customerNumber", "customers.customerNumber")
        .join("orderdetails", "orderdetails.orderNumber", "orders.orderNumber")
        .whereBetween("orders.orderDate", [start_date, end_date])
        .groupBy("offices.officeCode")
        .orderBy("offices.officeCode");

    return rawData;
};

const getRevenueByProductLineInRangeTimeByOffice = async (
    start_date,
    end_date = moment().format("YYYY-MM-DD"),
    officeCode,
) => {
    await common.checkValidOfficeCode(officeCode);
    if (start_date >= end_date) {
        throw new AppError("start_date must be less than end_date");
    }
    if (!start_date) {
        const minOrderDate = await Order.query().min("orderDate as minOrder");
        start_date = minOrderDate[0].minOrder;
    }
    const rawData = await Office.query()
        .select(
            raw(
                "sum(orderdetails.quantityOrdered * orderdetails.priceEach) as revenue, productlines.productLine",
            ),
        )
        .from("offices")
        .join("employees", "employees.officeCode", "offices.officeCode")
        .join("customers", "customers.salesRepEmployeeNumber", "employees.employeeNumber")
        .join("orders", "orders.customerNumber", "customers.customerNumber")
        .join("orderdetails", "orderdetails.orderNumber", "orders.orderNumber")
        .join("products", "products.productCode", "orderdetails.productCode")
        .join("productlines", "productlines.productLine", "products.productLine")
        .where("offices.officeCode", officeCode)
        .whereBetween("orders.orderDate", [start_date, end_date])
        .groupBy("productlines.productLine")
        .orderBy("productlines.productLine");

    return { officeCode, Revenues: rawData };
};

const getRevenueOfCustomers = async (start_date, end_date = moment().format("YYYY-MM-DD")) => {
    if (start_date >= end_date) {
        throw new AppError("start_date must be less than end_date", 500);
    }
    if (!start_date) {
        const minOrderDate = await Order.query().min("orderDate as minOrder");
        start_date = minOrderDate[0].minOrder;
    }
    const rawData = await Employee.query()
        .select(
            raw(
                "sum(orderdetails.quantityOrdered * orderdetails.priceEach) as revenue, employees.employeeNumber",
            ),
        )
        .countDistinct("customers.customerNumber")
        .from("employees")
        .join("customers", "customers.salesRepEmployeeNumber", "employees.employeeNumber")
        .join("orders", "orders.customerNumber", "customers.customerNumber")
        .join("orderdetails", "orderdetails.orderNumber", "orders.orderNumber")
        .whereBetween("orders.orderDate", [start_date, end_date])
        .groupBy("employees.employeeNumber")
        .orderBy("employees.employeeNumber");
    const revenue = rawData.map((item) => {
        return {
            employeeNumber: item.employeeNumber,
            revenue: item.revenue,
            customers: item["count(distinct `customers`.`customerNumber`)"],
        };
    });
    return revenue;
};

module.exports = {
    getRevenueByOfficeInRangeTime,
    getRevenueByProductLineInRangeTimeByOffice,
    getRevenueOfCustomers,
};
