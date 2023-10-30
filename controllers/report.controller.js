const {
    getRevenueByOfficeInRangeTime,
    getRevenueByProductLineInRangeTimeByOffice,
    getRevenueOfCustomers,
} = require("../services/report.service");
const { handleError, AppError } = require("../middlewares/handleError/error");

exports.revenueByOffice = handleError(async (req, res) => {
    const { start_date, end_date } = req.query;

    if (start_date < end_date) {
        throw new AppError("start_date must be less than end_date");
    }
    const revenue = await getRevenueByOfficeInRangeTime(start_date, end_date);
    res.status(200).send({
        success: true,
        message: "Sales revenue by office for a given period of time",
        data: revenue,
    });
});

exports.revenueByProductLine = handleError(async (req, res) => {
    const { start_date, end_date } = req.query;

    const { officeCode } = req.params;
    const revenue = await getRevenueByProductLineInRangeTimeByOffice(
        start_date,
        end_date,
        officeCode,
    );
    res.status(200).send({
        success: true,
        message: "Sales revenue by productLine for a given period of time in each office",
        data: revenue,
    });
});

exports.revenueByCustomers = handleError(async (req, res) => {
    const { start_date, end_date } = req.query;
    const revenue = await getRevenueOfCustomers(start_date, end_date);

    res.status(200).send({
        success: true,
        message: "Sales revenue by customers for a given period of time",
        data: revenue,
    });
});
