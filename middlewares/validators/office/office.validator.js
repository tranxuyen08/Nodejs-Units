const { celebrate, Joi } = require("celebrate");

const officeSchema = {
    officeCode: Joi.string().max(10).required(),
    city: Joi.string().min(2).max(50).required(),
    phone: Joi.string().min(2).max(50).required(),
    addressLine1: Joi.string().max(50).required(),
    addressLine2: Joi.string().max(50).allow(null).required(),
    state: Joi.string().max(50).allow(null).required(),
    country: Joi.string().min(2).max(50).required(),
    postalCode: Joi.string().min(5).max(15).required(),
    territory: Joi.string().min(2).max(10).required(),
    created_by: Joi.number().positive().optional(),
    updated_by: Joi.number().positive().optional().allow(null),
    created_on: Joi.date().timestamp().optional(),
    updated_on: Joi.date().timestamp().optional().allow(null),
};

const key = Object.keys(officeSchema);

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
    officeCode: Joi.string().max(10).optional(),
    city: Joi.string().min(2).max(50).optional(),
    phone: Joi.string().min(2).max(50).optional(),
    addressLine1: Joi.string().max(50).optional(),
    addressLine2: Joi.string().max(50).allow(null).optional(),
    state: Joi.string().max(50).allow(null).optional(),
    country: Joi.string().min(2).max(50).optional(),
    postalCode: Joi.string().min(3).max(15).optional(),
    created_by: Joi.string()
        .regex(/^[0-9]*$/)
        .optional(),
    updated_by: Joi.string()
        .regex(/^[0-9]*$/)
        .optional()
        .allow(null),
};

const validateOffice = celebrate(
    {
        body: Joi.object().keys(officeSchema),
        query: Joi.object().keys(querySchema),
    },
    {
        abortEarly: false,
        convert: false,
        presence: "required",
        escapeHtml: true,
    },
);

module.exports = {
    officeSchema,
    validateOffice,
};
