const employeeService = require("../services/employees.service");
const { handleError } = require("../middlewares/handleError/error");

exports.getAllemployeeController = handleError(async (req, res) => {
    const { employeeNumber, officeCode, jobTitle } = res.locals.authData;
    const filters = req.query;
    let employees;

    if (jobTitle === "President") {
        employees = await employeeService.getAllEmployees(filters);
    } else if (jobTitle === "Manager") {
        employees = await employeeService.getAllEmployeesBelongToOffice(officeCode, filters);
    } else if (jobTitle === "Leader") {
        employees = await employeeService.getAllEmployeesReportsTo(employeeNumber, filters);
    }

    res.status(200).send({
        success: true,
        message: "All employees",
        data: employees,
    });
});

exports.getEmployeeByIDController = handleError(async (req, res) => {
    const { employeeNumber } = req.params;
    const { officeCode, jobTitle, employeeNumber: reportsTo } = res.locals.authData;
    let employee;
    if (jobTitle === "President") {
        employee = employeeService.getEmployeeById(employeeNumber);
    } else if (jobTitle === "Manager") {
        employee = employeeService.getEmployeeBelongToOffice(employeeNumber, officeCode);
    } else if (jobTitle === "Leader") {
        employee = employeeService.getEmployeeReportsTo(employeeNumber, reportsTo);
    }
    const result = await employee;
    res.status(200).send({
        success: true,
        message: "Info of employee",
        data: result,
    });
});

exports.createEmployeeController = handleError(async (req, res) => {
    const employee = req.body || {};
    const { employeeNumber: created_by } = res.locals.authData;
    const result = await employeeService.createNewEmployee(employee, created_by);
    res.status(201).send({
        success: true,
        message: "Create successfully",
        employeeNumber: result.employeeNumber,
    });
});

exports.updateEmployeeController = handleError(async (req, res) => {
    const employeeInfo = req.body || {};
    const { employeeNumber } = req.params;
    const { employeeNumber: updated_by, jobTitle } = res.locals.authData;
    if (jobTitle === "President") {
        await employeeService.updateInfoEmployee(employeeInfo, employeeNumber, updated_by);
    } else if (jobTitle === "Manager") {
        await employeeService.updateInfoEmployeeBelongToOffice(
            employeeInfo,
            employeeNumber,
            updated_by,
        );
    }

    res.status(200).send({
        success: true,
        message: "Update successfully",
    });
});

exports.deleteEmployeeController = handleError(async (req, res) => {
    const { employeeNumber } = req.params;
    await employeeService.deleteEmployee(employeeNumber);

    res.status(200).send({
        success: true,
        message: "Delete successfully",
    });
});

exports.createAdvance = handleError(async (req, res, next) => {
    const employee = req.body;
    const { employeeNumber: created_by } = res.locals.authData;
    await employeeService.createEmployeeAdvance(employee, created_by);
    res.status(201).send({
        success: true,
        message: "Create employee successfully",
    });
});

exports.deleteAdvance = handleError(async (req, res, next) => {
    const { employeeNumber } = req.params;
    const result = await employeeService.deleteEmployeeAdvance(employeeNumber);
    if (result) {
        res.status(200).send({
            success: true,
            message: "Delete and tranfer customers successfully",
        });
    }
});
