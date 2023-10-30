const moment = require("moment");
const { AppError } = require("../middlewares/handleError/error");
const Order = require("../models/orders.model");
const OrderDetail = require("../models/orderdetails.model");
const common = require("../utils/common");
const Payment = require("../models/payment.model");

const getAllOrder = async (filters) => {
    const minOrderDate = await Order.query().min("orderDate as minOrder");
    const defaultStart_date = minOrderDate[0].minOrder;
    const {
        start_date = moment(defaultStart_date).format("YYYY-MM-DD"),
        end_date = moment().format("YYYY-MM-DD"),
        current_page = 0,
        page_size = 10,
        sort_by = "orderNumber",
        sort_type = "asc",
        ...filter
    } = filters;
    const initialQuery = [
        `SELECT * FROM FA_NODEJS.orders WHERE orderDate BETWEEN "${start_date}" AND "${end_date}"`,
    ];
    const result = await common.getAllAnyResource(
        initialQuery,
        filter,
        sort_by,
        sort_type,
        page_size,
        current_page,
    );
    return result;
};

const getOrderByOrderNumber = async (orderNumber) => {
    await common.checkValidOrderNumber(orderNumber);
    const order = await Order.query().findOne({ orderNumber, deleted: false });
    return order;
};

const getOrderCustomerSelf = async (customerNumber) => {
    const order = await Order.query()
        .where({ customerNumber, deleted: false })
        .select("orderNumber", "orderDate", "requiredDate", "shippedDate", "status", "created_by")
        .withGraphFetched("orderdetails(selectOrderDetails)")
        .modifiers({
            selectOrderDetails(builder) {
                builder.select("productCode", "quantityOrdered", "priceEach", "orderLineNumber");
            },
        });
    if (!order) {
        throw new AppError("You don't have any order! Order now!", 404);
    }
    return order;
};

const updateOrderByOrderNumber = async (orderNumber, order, updated_by) => {
    let newStatus;
    const updated_on = moment().format("YYYY-MM-DDTHH:mm:ss");
    const orderDB = await common.checkValidOrderNumber(orderNumber);
    if (orderDB.status === "In Process") {
        if (
            order.status === "Disputed" ||
            order.status === "On Hold" ||
            order.status === "Cancelled" ||
            order.status === "Shipped"
        ) {
            newStatus = Order.query()
                .update({ ...order, updated_by, updated_on })
                .findOne({ orderNumber });
        } else {
            throw new AppError("Please follow the procedure!", 400);
        }
    } else if (
        (orderDB.status === "Disputed" && order.status === "Resolved") ||
        (orderDB.status === "Resolved" && order.status === "Cancelled") ||
        (orderDB.status === "On Hold" && order.status === "Cancelled") ||
        (orderDB.status === "On Hold" && order.status === "Shipped") ||
        (orderDB.status === "On Hold" && order.status === "In Process")
    ) {
        newStatus = Order.query()
            .update({ ...order, updated_by, updated_on })
            .findOne({ orderNumber });
    } else if (
        orderDB.status === "COD" ||
        (orderDB.status === "Shipped" && order.status === "Resolved") ||
        (orderDB.status === "Shipped" && order.status === "On Hold") ||
        (orderDB.status === "Shipped" && order.status === "In Process") ||
        (orderDB.status === "Resolved" && order.status === "Disputed") ||
        (orderDB.status === "Resolved" && order.status === "On Hold") ||
        (orderDB.status === "Resolved" && order.status === "In Process") ||
        (orderDB.status === "Disputed" && order.status === "In Process") ||
        (orderDB.status === "Disputed" && order.status === "On Hold") ||
        (orderDB.status === "Cancelled" && order.status === "In Process") ||
        (orderDB.status === "Cancelled" && order.status === "Resolved") ||
        (orderDB.status === "Cancelled" && order.status === "Disputed") ||
        (orderDB.status === "Cancelled" && order.status === "On Hold") ||
        (orderDB.status === "On Hold" && order.status === "Disputed") ||
        (orderDB.status === "On Hold" && order.status === "Resolved")
    ) {
        throw new AppError("Please follow the procedure!", 400);
    }
    const result = await newStatus;
    return result;
};

const createOrder = async (order, created_by) => {
    const customer = await common.checkValidCustomerNumber(order.customerNumber);
    const paymentDate = moment().format("YYYY-MM-DD");
    const checkNumber = common.random8Character();

    const currOrderNumber = await Order.query().max("orderNumber as maxNum");
    const newOrderNumber = currOrderNumber[0].maxNum + 1;

    const obj = order.orderdetails.map(async (item) => {
        const priceEach = await common.checkValidProductCode(item.productCode);
        return {
            ...item,
            priceEach: priceEach.buyPrice,
        };
    });
    const orderdetails = await Promise.all(obj);
    const amount = common.totalBill(orderdetails);
    const newOrder = await Order.transaction(async (trx) => {
        let insertOrder;
        const total = await common.getTotalAmountProcess(order.customerNumber);
        if (
            (order.status === "COD" && total < customer.creditLimit) ||
            order.status === "In Process"
        ) {
            insertOrder = await Order.query(trx).insertGraphAndFetch({
                ...order,
                orderNumber: newOrderNumber,
                created_by,
                orderdetails,
            });
            await Payment.query(trx).insert({
                customerNumber: order.customerNumber,
                checkNumber,
                paymentDate,
                created_by,
                amount,
            });
        } else {
            throw new AppError("Your account is not enough to order COD ship!", 400);
        }
        return insertOrder;
    });
    return newOrder;
};

const deleteOrder = async (orderNumber) => {
    const order = await common.checkValidOrderNumber(orderNumber);
    const trans = Order.transaction(async (trx) => {
        await Order.query(trx).update({ deleted: true }).findOne({ orderNumber });
        await OrderDetail.query(trx).update({ deleted: true }).where({ orderNumber });
        const amount = await common.getTotalAmount(orderNumber);
        await Payment.query(trx)
            .update({ deleted: true })
            .where({ customerNumber: order.customerNumber, amount });
    });

    if (!trans) {
        throw new AppError("Something went very wrong!");
    }
    return trans;
};

module.exports = {
    getAllOrder,
    getOrderByOrderNumber,
    createOrder,
    getOrderCustomerSelf,
    updateOrderByOrderNumber,
    deleteOrder,
};
