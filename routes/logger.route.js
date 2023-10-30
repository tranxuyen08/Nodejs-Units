const express = require("express");
const auth = require("../middlewares/auth/auth");
const { validateLogger } = require("../middlewares/validators/logger/logger.validator");
const loggerController = require("../controllers/logger.controller");

const router = express.Router();

router.get("/", auth(["President"]), validateLogger, loggerController.getAllLogger);

module.exports = router;
