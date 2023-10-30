const { celebrate } = require("celebrate");
const Joi = require("joi");

const status = ["On Hold", "Disputed", "Resolved", "Cancelled", "Shipped", "In Process"];
const orderSchema = {
    orderNumber: Joi.number().positive().optional(),
    orderDate: Joi.string().isoDate().allow(null).optional(),
    requiredDate: Joi.string().isoDate().allow(null).required(),
    shippedDate: Joi.string().isoDate().allow(null).required(),
    status: Joi.string().max(20).valid("In Process", "COD").optional(),
    comments: Joi.string().max(10).max(4000).allow(null).optional(),
    customerNumber: Joi.number().positive().required(),
    orderdetails: Joi.array().items(
        Joi.object().keys({
            orderNumber: Joi.number().positive().allow(null).optional(),
            productCode: Joi.string().min(5).optional(),
            quantityOrdered: Joi.number().positive().required(),
            orderLineNumber: Joi.number().positive().required(),
        }),
    ),
};

const orderSchemaUpdate = {
    status: Joi.string()
        .max(20)
        .valid(...status)
        .optional(),
    comments: Joi.string().max(10).max(4000).allow(null).optional(),
};

const querySchema = {
    start_date: Joi.string().isoDate().allow(null).optional(),
    end_date: Joi.string().isoDate().allow(null).optional(),
    current_page: Joi.string()
        .regex(/^[0-9]*$/)
        .optional(),
    page_size: Joi.string()
        .regex(/^[0-9]*$/)
        .optional(),
    orderDate: Joi.string().isoDate().allow(null).optional(),
    requiredDate: Joi.string().isoDate().allow(null).optional(),
    shippedDate: Joi.string().isoDate().allow(null).optional(),
    status: Joi.string().optional(),
    customerNumber: Joi.string()
        .regex(/^[0-9]*$/)
        .optional(),
    created_by: Joi.number().positive().optional(),
    updated_by: Joi.number().positive().optional().allow(null),
    sort_by: Joi.string()
        .valid("orderDate", "orderNumber", "requiredDate", "shippedDate", "customerNumber")
        .optional(),
    sort_type: Joi.string().valid("asc", "desc").optional(),
};

const schemaPrams = {
    orderNumber: Joi.string()
        .regex(/^[0-9]*$/)
        .optional(),
};

const validateOrder = celebrate(
    {
        body: Joi.object().keys(orderSchema),
        query: Joi.object().keys(querySchema),
        params: Joi.object().keys(schemaPrams),
    },
    {
        abortEarly: false,
        convert: false,
        presence: "required",
        escapeHtml: true,
    },
);

const validateOrderUpdate = celebrate(
    {
        body: Joi.object().keys(orderSchemaUpdate),
        params: Joi.object().keys(schemaPrams),
    },
    {
        abortEarly: false,
        convert: false,
        presence: "required",
        escapeHtml: true,
    },
);

module.exports = {
    validateOrder,
    orderSchema,
    orderSchemaUpdate,
    validateOrderUpdate,
};
