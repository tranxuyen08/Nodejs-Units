const moment = require("moment");
const { AppError } = require("../middlewares/handleError/error");
const Employee = require("../models/employee.model");
const customerService = require("./customers.service");
const common = require("../utils/common");
const { employeeSchema } = require("../middlewares/validators/employee/employee.validator");
const validate = require("../middlewares/validators/common/common.validator");

const getAllEmployees = async (filters) => {
    const {
        current_page = 0,
        page_size = 10,
        sort_by = "employeeNumber",
        sort_type = "ASC",
        ...filter
    } = filters;

    const initialQuery = [`SELECT * FROM FA_NODEJS.employees where NOT employeeNumber IS NULL`];

    const result = await common.getAllAnyResource(
        initialQuery,
        filter,
        sort_by,
        sort_type,
        page_size,
        current_page,
    );

    await validate.ResArrValidate(employeeSchema, result);
    return result;
};

const getAllEmployeesBelongToOffice = async (officeCode, filters) => {
    const {
        current_page = 0,
        page_size = 10,
        sort_by = "employeeNumber",
        sort_type = "asc",
        ...filter
    } = filters;
    const initialQuery = [
        `SELECT * FROM FA_NODEJS.employees where NOT employeeNumber IS NULL AND officeCode=${officeCode}`,
    ];
    const result = await common.getAllAnyResource(
        initialQuery,
        filter,
        sort_by,
        sort_type,
        page_size,
        current_page,
    );
    await validate.ResArrValidate(employeeSchema, result);
    return result;
};

const getAllEmployeesReportsTo = async (reportsTo, filters) => {
    const {
        current_page = 0,
        page_size = 10,
        sort_by = "employeeNumber",
        sort_type = "asc",
        ...filter
    } = filters;
    const initialQuery = [
        `SELECT * FROM FA_NODEJS.employees where NOT employeeNumber IS NULL AND reportsTo=${reportsTo}`,
    ];

    const result = await common.getAllAnyResource(
        initialQuery,
        filter,
        sort_by,
        sort_type,
        page_size,
        current_page,
    );
    await validate.ResArrValidate(employeeSchema, result);
    return result;
};

const getEmployeeById = async (employeeNumber) => {
    await common.checkValidEmployeeNumber(employeeNumber);

    const employee = await Employee.query().findOne({ employeeNumber });
    await validate.ResByIDValidate(employeeSchema, employee);
    return employee;
};

const getEmployeeBelongToOffice = async (employeeNumber, officeCode) => {
    await common.checkValidEmployeeNumber(employeeNumber);

    const employee = await Employee.query().findOne({ employeeNumber, officeCode });
    if (!employee) {
        throw new AppError("You cannot read this employee infomation");
    }
    await validate.ResByIDValidate(employeeSchema, employee);
    return employee;
};

const getEmployeeReportsTo = async (employeeNumber, reportsTo) => {
    await common.checkValidEmployeeNumber(employeeNumber);

    const employee = await Employee.query().findOne({ employeeNumber, reportsTo });
    if (!employee) {
        throw new AppError("You cannot read this employee infomation");
    }
    await validate.ResByIDValidate(employeeSchema, employee);
    return employee;
};

const createNewEmployee = async (employee, created_by) => {
    await Promise.all([
        common.checkValidReportsTo(employee.reportsTo),
        common.checkDuplicateEmailCreate(employee.email),
        common.checkValidOfficeCode(employee.officeCode),
    ]);
    const newEmployee = await Employee.query().insert({ ...employee, created_by });
    return newEmployee;
};

const updateInfoEmployee = async (employee, employeeNumber, updated_by) => {
    await Promise.all([
        common.checkValidEmployeeNumber(employeeNumber),
        common.checkValidReportsTo(employee.reportsTo),
        common.checkValidOfficeCode(employee.officeCode),
        common.checkChangeFirstNameAndLastName(employee, employeeNumber),
        common.checkDuplicateEmailUpdate(employee.email, employeeNumber),
    ]);
    const updated_on = moment().format("YYYY-MM-DDTHH:mm:ss");
    const result = await Employee.query()
        .update({ ...employee, updated_by, updated_on })
        .where("employeeNumber", employeeNumber);
    return result;
};

const updateInfoEmployeeBelongToOffice = async (employeeInfo, employeeNumber, updated_by) => {
    const employee = await common.checkValidEmployeeNumber(employeeNumber);
    await Promise.all([
        common.checkValidReportsTo(employeeInfo.reportsTo),
        common.checkValidOfficeCode(employeeInfo.officeCode),
    ]);

    if (employeeInfo.officeCode !== employee.officeCode) {
        throw new AppError("You cannot change officeCode", 400);
    }
    const updated_on = moment().format("YYYY-MM-DDTHH:mm:ss");
    const result = await Employee.query()
        .update({ ...employeeInfo, updated_by, updated_on })
        .where("employeeNumber", employeeNumber);
    return result;
};

const deleteEmployee = async (employeeNumber) => {
    await common.checkValidEmployeeNumber(employeeNumber);

    const isDefaultEmployee = await Employee.query().findOne({
        employeeNumber,
        lastName: "99999",
    });

    if (isDefaultEmployee) {
        throw new AppError("You cannot delete this employee!", 400);
    }
    const result = await Employee.query().delete().where({ employeeNumber });

    return result;
};

const createEmployeeAdvance = async (employee, created_by) => {
    await Promise.all([
        common.checkValidReportsTo(employee.reportsTo),
        common.checkDuplicateEmailCreate(employee.email),
        common.checkValidOfficeCode(employee.officeCode),
    ]);
    const { customers } = employee;
    const newCustomer = customers.map((item) => {
        item.created_by = created_by;
        return item;
    });
    employee.customers = newCustomer;
    const newEmployee = await Employee.transaction(async (trx) => {
        const employees = await Employee.query(trx).insertGraph({ ...employee, created_by });
        return employees;
    });
    return newEmployee;
};

const deleteEmployeeAdvance = async (employeeNumber) => {
    const employee = await Employee.query()
        .findOne({
            employeeNumber,
        })
        .whereNot({ lastName: "99999" });
    if (!employee) {
        throw new AppError("employeeNumber is invalid or Cannot delete this employee", 400);
    }

    const { officeCode } = employee;

    const defaultEmployee = await common.getDefaultEmployee(officeCode);

    const { employeeNumber: newEmployeeNumber } = defaultEmployee;

    const update = await customerService.updateMutipleCustomer(
        { salesRepEmployeeNumber: newEmployeeNumber },
        employeeNumber,
    );
    if (update) {
        const result = await Employee.query().delete().where({
            employeeNumber: employeeNumber,
        });
        return result;
    }
};

module.exports = {
    getAllEmployees,
    getAllEmployeesBelongToOffice,
    getEmployeeById,
    createNewEmployee,
    updateInfoEmployee,
    updateInfoEmployeeBelongToOffice,
    deleteEmployee,
    createEmployeeAdvance,
    deleteEmployeeAdvance,
    getAllEmployeesReportsTo,
    getEmployeeBelongToOffice,
    getEmployeeReportsTo,
};
