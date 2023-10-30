const { getLogger } = require("../services/logger.service");
const { handleError } = require("../middlewares/handleError/error");

exports.getAllLogger = handleError(async (req, res) => {
    const filters = req.query;
    const logger = await getLogger(filters);
    res.status(200).send({
        logger,
    });
});
