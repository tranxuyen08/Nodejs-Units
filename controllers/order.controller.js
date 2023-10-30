const { handleError } = require("../middlewares/handleError/error");
const orderService = require("../services/order.service");

exports.getAllOrderController = handleError(async (req, res) => {
    const filters = req.query;
    const orders = await orderService.getAllOrder(filters);
    res.status(200).send({
        success: true,
        count: orders.length,
        orders: orders,
    });
});

exports.getOrderByOrderNumberController = handleError(async (req, res) => {
    const { orderNumber } = req.params;
    const order = await orderService.getOrderByOrderNumber(orderNumber);
    res.status(200).send({
        success: true,
        orders: order,
    });
});

exports.getOrderForCustomerController = handleError(async (req, res) => {
    const { customerNumber } = res.locals.authData;
    const myOrder = await orderService.getOrderCustomerSelf(customerNumber);
    res.status(200).send({
        success: true,
        count: myOrder.length,
        myOrder: myOrder,
    });
});

exports.createNewOrderController = handleError(async (req, res) => {
    const order = req.body;
    let created_by;

    if (res.locals.authData.employeeNumber) {
        created_by = res.locals.authData.employeeNumber;
    } else {
        created_by = res.locals.authData.customerNumber;
    }
    const newOrder = await orderService.createOrder(order, created_by);
    res.status(201).send({
        success: true,
        order: newOrder,
    });
});

exports.updateOrderController = handleError(async (req, res) => {
    const order = req.body;
    const { employeeNumber: updated_by } = res.locals.authData;
    const { orderNumber } = req.params;
    await orderService.updateOrderByOrderNumber(orderNumber, order, updated_by);

    res.status(200).send({
        success: true,
        message: "Update status order successfully",
    });
});

exports.deleteOrderController = handleError(async (req, res) => {
    const { orderNumber } = req.params;
    await orderService.deleteOrder(orderNumber);
    res.status(200).send({
        success: true,
        message: "Deleted order successfully!",
    });
});
