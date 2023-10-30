const { celebrate, Joi } = require("celebrate");

const customerSchema = {
    customerNumber: Joi.number().positive().optional(),
    customerName: Joi.string().min(5).max(50).required(),
    contactLastName: Joi.string().min(3).max(50).required(),
    contactFirstName: Joi.string().min(3).max(50).required(),
    phone: Joi.string().min(8).max(20).required(),
    addressLine1: Joi.string().max(10).max(50).required(),
    addressLine2: Joi.string().max(10).max(50).optional().allow(null),
    city: Joi.string().min(2).max(50).required(),
    state: Joi.string().min(2).max(50).allow(null).optional(),
    postalCode: Joi.string().min(5).max(15).allow(null).optional(),
    country: Joi.string().min(2).max(50).required(),
    salesRepEmployeeNumber: Joi.number().positive().allow(null).required(),
    creditLimit: Joi.number().positive().max(99999999).precision(2).allow(null).optional(),
    created_by: Joi.number().positive().optional(),
    updated_by: Joi.number().positive().optional().allow(null),
    created_on: Joi.date().timestamp().optional(),
    updated_on: Joi.date().timestamp().optional().allow(null),
};

const key = Object.keys(customerSchema);

const querySchema = {
    city: Joi.string().min(2).max(50).optional(),
    country: Joi.string().min(2).max(50).optional(),
    salesRepEmployeeNumber: Joi.string()
        .ruleset.regex(/^[0-9]*$/)
        .rule({ message: "salesRepEmployeeNumber must be a number" })
        .optional(),
    postalCode: Joi.string()
        .ruleset.min(2)
        .rule({ message: "postalCode contain at least 5 characters" })
        .ruleset.max(15)
        .rule({ message: "postalCode should not be more than 20 characters long" })
        .optional(),
    phone: Joi.string().min(3).max(20).optional(),
    current_page: Joi.string()
        .ruleset.regex(/^[0-9]*$/)
        .rule({ message: "current_page must be a number" })
        .optional(),
    page_size: Joi.string()
        .ruleset.regex(/^[0-9]*$/)
        .rule({ message: "page_size must be a number" })
        .optional(),
    customerNumber: Joi.string()
        .regex(/^[0-9]*$/)
        .optional(),
    sort_by: Joi.string()
        .valid(...key)
        .optional(),
    sort_type: Joi.string().valid("asc", "desc").optional(),
    customerName: Joi.string()
        .ruleset.min(3)
        .rule({ message: "postalCode contain at least 5 characters" })
        .max(50)
        .optional(),
    contactLastName: Joi.string()
        .ruleset.min(3)
        .rule({ message: "contactLastName contain at least 3 characters" })
        .max(50)
        .optional(),
    contactFirstName: Joi.string()
        .ruleset.min(3)
        .rule({ message: "contactFirstName contain at least 3 characters" })
        .max(50)
        .optional(),
    addressLine1: Joi.string()
        .ruleset.min(3)
        .rule({ message: "addressLine1 contain at least 5 characters" })
        .max(10)
        .optional(),
    addressLine2: Joi.string().max(10).max(50).optional().allow(null),
    state: Joi.string()
        .ruleset.min(2)
        .rule({ message: "addressLine1 contain at least 5 characters" })
        .max(50)
        .allow(null)
        .optional(),
    creditLimit: Joi.string()
        .ruleset.regex(/^[+]?((\d+(\.\d*)?)|(\.\d+))$/)
        .rule({ message: "creditLimit must be a positive number" })
        .ruleset.max(99999999)
        .rule({ message: "creditLimit cannot over 99999999" })
        .allow(null)
        .optional(),
    created_by: Joi.string()
        .ruleset.regex(/^[0-9]*$/)
        .rule({ message: "creditLimit must be a positive number" })
        .optional(),
    updated_by: Joi.string()
        .ruleset.regex(/^[0-9]*$/)
        .rule({ message: "creditLimit must be a positive number" })
        .allow(null)
        .optional(),
    created_on: Joi.date().timestamp().optional(),
    updated_on: Joi.date().timestamp().optional().allow(null),
};

const paramsSchema = {
    customerNumber: Joi.string()
        .ruleset.regex(/^[0-9]*$/)
        .rule({ message: "customerNumber must be a positive number" })
        .optional(),
};

const validateCustomer = celebrate(
    {
        body: Joi.object().keys(customerSchema),
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
    validateCustomer,
    customerSchema,
};
