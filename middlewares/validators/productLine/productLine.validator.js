const { celebrate, Joi } = require("celebrate");

const productLineSchema = {
    productLine: Joi.string().min(5).required(),
    textDescription: Joi.string().min(20).required(),
    htmlDescription: Joi.string().allow(null).required(),
    image: Joi.string().allow(null).required(),
    created_by: Joi.number().positive().optional(),
    updated_by: Joi.number().positive().optional().allow(null),
    created_on: Joi.date().timestamp().optional(),
    updated_on: Joi.date().timestamp().optional().allow(null),
};

const key = Object.keys(productLineSchema);

const querySchema = {
    productLine: Joi.string().min(3).optional(),
    created_by: Joi.string()
        .ruleset.regex(/^[0-9]*$/)
        .rule({ message: "updated_by must be a positive number" })
        .optional()
        .allow(null),
    updated_by: Joi.string()
        .ruleset.regex(/^[0-9]*$/)
        .rule({ message: "updated_by must be a positive number" })
        .optional()
        .allow(null),
    created_on: Joi.date().timestamp().optional(),
    updated_on: Joi.date().timestamp().optional().allow(null),
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
};

const paramSchema = {
    productLine: Joi.string()
        .ruleset.min(5)
        .rule({ message: "productLine contain at least 5 characters" })
        .optional(),
};

const validateProductLine = celebrate(
    {
        body: Joi.object().keys(productLineSchema),
        query: Joi.object().keys(querySchema),
        params: Joi.object().keys(paramSchema),
    },
    {
        abortEarly: false,
        convert: false,
        presence: "required",
        escapeHtml: true,
    },
);

module.exports = {
    productLineSchema,
    validateProductLine,
};
