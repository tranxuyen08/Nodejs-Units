const Joi = require("joi");

const ResArrValidate = async (schema, arr) => {
    const res = Joi.array().items(Joi.object().keys(schema));
    await res.validateAsync(arr);
};

const ResByIDValidate = async (schema, object) => {
    const res = Joi.object().keys(schema);
    await res.validateAsync(object);
};

module.exports = {
    ResArrValidate,
    ResByIDValidate,
};
