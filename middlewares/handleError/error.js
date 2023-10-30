const { isCelebrateError } = require("celebrate");
const { loggerToDb } = require("../../services/logger.service");

class AppError extends Error {
    constructor(message, statusCode, status) {
        super(message);

        this.statusCode = statusCode;
        this.status = status;
        Error.captureStackTrace(this, this.constructor);
    }
}

const handleError = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

const handleErrorsGlobal = async (error, req, res, next) => {
    const headerInfo = {
        userInfo: res.locals.authData,
        action: req.originalUrl,
        method: req.method,
    };

    const { statusCode = 500, status = "error", message } = error;
    if (isCelebrateError(error)) {
        if (process.env.NODE_ENV === "production") {
            return res.status(500).send({
                status: "failed",
                message: "Somthing went very wrong!",
            });
        }
        let errorMsg;
        if (error.details.get("body")) {
            errorMsg = error.details.get("body").details.map((item) => {
                return item.message;
            });
        }

        if (error.details.get("query")) {
            errorMsg = error.details.get("query").details.map((item) => {
                return item.message;
            });
        }

        if (error.details.get("params")) {
            errorMsg = error.details.get("params").details.map((item) => {
                return item.message;
            });
        }
        return res.status(400).send({
            status,
            message: errorMsg,
        });
    }
    if (headerInfo.userInfo && !headerInfo.userInfo.customerNumber) {
        await loggerToDb(error, headerInfo);
    }
    return res.status(statusCode).send({
        status,
        message,
    });
};

module.exports = {
    AppError,
    handleError,
    handleErrorsGlobal,
};
