const { celebrate } = require("celebrate");
const Joi = require("joi");

const querySchema = {
    start_date: Joi.string().isoDate().allow(null).optional(),
    end_date: Joi.string().isoDate().allow(null).optional(),
    employeeNumber: Joi.string()
        .regex(/^[0-9]*$/)
        .optional(),
    officeCode: Joi.string().optional(),
    jobTitle: Joi.string().valid("President", "Manager", "Leader", "Staff", "Customer").optional(),
    current_page: Joi.string()
        .regex(/^[0-9]*$/)
        .optional(),
    page_size: Joi.string()
        .regex(/^[0-9]*$/)
        .optional(),
};

const validateLogger = celebrate(
    {
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
    validateLogger,
};
