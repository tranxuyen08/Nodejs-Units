const express = require("express");
const auth = require("../middlewares/auth/auth");
const { validateEmployee } = require("../middlewares/validators/employee/employee.validator");
const { validateEmployeeCus } = require("../middlewares/validators/employee/employeeCus.validator");
const employeeController = require("../controllers/employee.controller");

const router = express.Router();

router.get(
    "/",
    auth(["President", "Manager", "Leader"]),
    validateEmployee,
    employeeController.getAllemployeeController,
);

router.get(
    "/:employeeNumber",
    validateEmployee,
    auth(["President", "Manager", "Leader"]),
    employeeController.getEmployeeByIDController,
);

router.post(
    "/",
    auth(["President"]),
    validateEmployee,
    employeeController.createEmployeeController,
);

router.post(
    "/advance",
    auth(["President", "Manager"]),
    validateEmployeeCus,
    employeeController.createAdvance,
);

router.delete("/advance/:employeeNumber", auth(["President"]), employeeController.deleteAdvance);

router.put(
    "/:employeeNumber",
    auth(["President", "Manager"]),
    validateEmployee,
    employeeController.updateEmployeeController,
);

router.delete("/:employeeNumber", auth(["President"]), employeeController.deleteEmployeeController);

module.exports = router;
