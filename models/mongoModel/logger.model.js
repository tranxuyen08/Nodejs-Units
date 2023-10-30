const mongoose = require("mongoose");

const LoggerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    action: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    createdBy: {
        employeeNumber: {
            type: Number,
            required: true,
        },
        officeCode: {
            type: Number,
            required: true,
        },
        jobTitle: {
            type: String,
            required: true,
        },
    },
    message: {
        type: String,
        required: true,
    },
});

const Logger = mongoose.model("Logger", LoggerSchema);
module.exports = Logger;
