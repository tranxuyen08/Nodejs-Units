const { celebrate, Joi } = require("celebrate");

const jobTitles = ["President", "Manager", "Leader", "Staff"];

const employeeSchema = {
    employeeNumber: Joi.number().positive().optional(),
    lastName: Joi.string().min(3).max(50).required(),
    firstName: Joi.string().min(3).max(50).required(),
    extension: Joi.string().max(50).required(),
    email: Joi.string().email({ minDomainSegments: 2 }).min(10).max(100).required(),
    officeCode: Joi.string().max(10).required(),
    reportsTo: Joi.number().positive().allow(null).optional(),
    jobTitle: Joi.string()
        .valid(...jobTitles)
        .required(),
    created_by: Joi.number().positive().optional(),
    updated_by: Joi.number().positive().optional().allow(null),
    created_on: Joi.date().timestamp().optional(),
    updated_on: Joi.date().timestamp().optional().allow(null),
};

const key = Object.keys(employeeSchema);

const schemaPrams = {
    employeeNumber: Joi.string()
        .ruleset.regex(/^[0-9]*$/)
        .rule({ message: "employeeNumber must be a positive number" })
        .optional(),
};

const querySchema = {
    officeCode: Joi.string().max(10).optional(),
    jobTitle: Joi.string()
        .valid(...jobTitles)
        .optional(),
    reportsTo: Joi.string()
        .ruleset.regex(/^[0-9]*$/)
        .rule({ message: "reportsTo must be a positive number" })
        .optional(),
    current_page: Joi.string()
        .ruleset.regex(/^[0-9]*$/)
        .rule({ message: "current_page must be a positive number" })
        .optional(),
    page_size: Joi.string()
        .ruleset.regex(/^[0-9]*$/)
        .rule({ message: "page_size must be a positive number" })
        .optional(),
    sort_by: Joi.string()
        .valid(...key)
        .optional(),
    sort_type: Joi.string().valid("asc", "desc").optional(),
    employeeNumber: Joi.string()
        .ruleset.regex(/^[0-9]*$/)
        .rule({ message: "employeeNumber must be a positive number" })
        .optional(),
    lastName: Joi.string().min(3).optional(),
    firstName: Joi.string().min(3).optional(),
    extension: Joi.string().min(3).max(50).optional(),
    email: Joi.string()
        .ruleset.min(3)
        .rule({ message: "email at least 3 characters" })
        .ruleset.max(100)
        .rule({ message: "email cannot over 100 character" })
        .optional(),
};

const validateEmployee = celebrate(
    {
        body: Joi.object().keys(employeeSchema),
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

module.exports = {
    validateEmployee,
    employeeSchema,
};
