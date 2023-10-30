const { celebrate, Joi } = require("celebrate");

const productSchema = {
    productCode: Joi.string().max(10).required(),
    productName: Joi.string().min(3).max(50).required(),
    productLine: Joi.string().min(3).max(50).required(),
    productScale: Joi.string().max(50).required(),
    productVendor: Joi.string().max(50).required(),
    productDescription: Joi.string().min(10).required(),
    quantityInStock: Joi.number().positive().required(),
    buyPrice: Joi.number().positive().required(),
    MSRP: Joi.number().positive().required(),
    created_by: Joi.number().positive().optional(),
    updated_by: Joi.number().positive().optional().allow(null),
    created_on: Joi.date().timestamp().optional(),
    updated_on: Joi.date().timestamp().optional().allow(null),
};

const key = Object.keys(productSchema);

const paramsSchema = {
    productCode: Joi.string().optional(),
};

const querySchema = {
    current_page: Joi.string()
        .regex(/^[0-9]*$/)
        .optional(),
    page_size: Joi.string()
        .regex(/^[0-9]*$/)
        .optional(),
    sort_by: Joi.string()
        .valid(...key)
        .optional(),
    sort_type: Joi.string().valid("asc", "desc").optional(),
    productCode: Joi.string().max(10).optional(),
    productName: Joi.string().min(3).max(50).optional(),
    productLine: Joi.string().min(3).max(50).optional(),
    productScale: Joi.string().max(50).optional(),
    productVendor: Joi.string().max(50).optional(),
    productDescription: Joi.string().min(10).optional(),
    quantityInStock: Joi.string()
        .regex(/^[0-9]*$/)
        .optional(),
    buyPrice: Joi.string()
        .regex(/^[+]?((\d+(\.\d*)?)|(\.\d+))$/)
        .optional(),
    MSRP: Joi.string()
        .regex(/^[+]?((\d+(\.\d*)?)|(\.\d+))$/)
        .optional(),
    created_by: Joi.string()
        .regex(/^[0-9]*$/)
        .optional(),
    updated_by: Joi.string()
        .regex(/^[0-9]*$/)
        .optional()
        .allow(null),
    created_on: Joi.date().timestamp().optional(),
    updated_on: Joi.date().timestamp().optional().allow(null),
};

const validateProduct = celebrate(
    {
        body: Joi.object().keys(productSchema),
        query: Joi.object().keys(querySchema),
        params: Joi.object().keys(paramsSchema),
    },
    {
        abortEarly: false,
        convert: false,
        presence: "required",
        escapeHtml: true,
    },
);
module.exports = {
    productSchema,
    validateProduct,
};
