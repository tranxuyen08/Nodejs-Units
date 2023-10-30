const { celebrate, Joi } = require("celebrate");
const { customerSchemaFull } = require("../customer/customer.validator");

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
    customers: Joi.array().items(Joi.object().keys(customerSchemaFull)),
};

const validateEmployeeCus = celebrate(
    {
        body: Joi.object().keys(employeeSchema),
    },
    {
        abortEarly: false,
        convert: false,
        presence: "required",
        escapeHtml: true,
        stripUnknown: { arrays: true },
    },
);

module.exports = {
    validateEmployeeCus,
};
