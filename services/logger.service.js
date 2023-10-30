const moment = require("moment");
const mongoDb = require("../models/mongoModel/index.model");

const LogModel = mongoDb.logger;

const loggerToDb = async (error, headerInfo) => {
    const { userInfo, action, method } = headerInfo;
    const log = await LogModel.create({
        title: error.message,
        time: moment().format("YYYY-MM-DDTHH:mm:ss"),
        action: `[${method}]: ${process.env.SERVER_HOST}${action}`,
        status: error.status || "Failed",
        createdBy: {
            employeeNumber: userInfo.employeeNumber,
            officeCode: userInfo.officeCode,
            jobTitle: userInfo.jobTitle,
        },
        message: error.stack,
    });
    return log;
};

const getLogger = async (filters) => {
    let {
        start_date,
        end_date = moment().format("YYYY-MM-DDTHH:mm:ss"),
        employeeNumber,
        jobTitle,
        officeCode,
        page_size = 10,
        current_page = 0,
    } = filters;
    let logger;
    page_size = Number(page_size);
    current_page = Number(current_page);
    if (!start_date) {
        throw new Error("Please provide start_date to get logger!");
    }
    if (employeeNumber) {
        logger = LogModel.find({
            time: {
                $gte: start_date,
                $lte: end_date,
            },
            createdBy: {
                employeeNumber,
            },
        })
            .skip(current_page > 0 ? (current_page - 1) * page_size : 0)
            .limit(page_size);
    } else if (officeCode) {
        logger = LogModel.find({
            time: {
                $gte: start_date,
                $lte: end_date,
            },
            createdBy: {
                officeCode,
            },
        })
            .skip(current_page > 0 ? (current_page - 1) * page_size : 0)
            .limit(page_size);
    } else if (jobTitle) {
        logger = LogModel.find({
            time: {
                $gte: start_date,
                $lte: end_date,
            },
            createdBy: {
                jobTitle,
            },
        })
            .skip(current_page > 0 ? (current_page - 1) * page_size : 0)
            .limit(page_size);
    } else {
        logger = LogModel.find({
            time: {
                $gte: start_date,
                $lte: end_date,
            },
        })
            .skip(current_page > 0 ? (current_page - 1) * page_size : 0)
            .limit(page_size);
    }
    const result = await logger;
    return result;
};

module.exports = { loggerToDb, getLogger };
