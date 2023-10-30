const express = require("express");
const { validateUser } = require("../middlewares/validators/user/user.validator");
const userController = require("../controllers/user.controller");

const router = express.Router();

router.post("/register", validateUser, userController.registerForEmployee);

router.post("/login", userController.loginForEmployee);

module.exports = router;
