const { celebrate, Joi } = require("celebrate");

const userCustomerSchema = {
    username: Joi.string()
        .ruleset.min(3)
        .rule({ message: "username length must be at least 3 characters long" })
        .ruleset.max(20)
        .rule({ message: "username length must be less than or equal to 20 characters long" })
        .required(),
    password: Joi.string()
        .ruleset.min(6)
        .rule({ message: "Password contains at least 6 characters" })
        .ruleset.max(100)
        .rule({ message: "Password must not be longer than 100 characters" })
        .ruleset.regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/)
        .rule({
            message:
                "Wrong password format! Password must have at least 1 uppercase character, 1 special character, number.",
        })
        .required(),
    customerNumber: Joi.number()
        .ruleset.positive()
        .rule({ message: "customerNumber must be a positive number" })
        .required(),
};

const validateUserCustomer = celebrate(
    {
        body: Joi.object().keys(userCustomerSchema),
    },
    {
        abortEarly: false,
        convert: false,
        presence: "required",
        escapeHtml: true,
    },
);

module.exports = {
    validateUserCustomer,
};
