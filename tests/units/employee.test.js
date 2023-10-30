const { expect } = require("chai");
const sinon = require("sinon");
const employeeService = require("../../services/employees.service");
const customerService = require("../../services/customers.service");
const Employee = require("../../models/employee.model");
const common = require("../../utils/common");
const validate = require("../../middlewares/validators/common/common.validator");

describe("Test getAllEmployee function", () => {
    afterEach(() => {
        sinon.restore();
    });
    beforeEach(() => {
        sinon.restore();
    });
    it("It should return array if have filters", async () => {
        const filters = {
            current_page: 0,
            page_size: 10,
            sort_by: "employeeNumber",
            sort_type: "ASC",
        };
        sinon.replace(validate, "ResArrValidate", sinon.fake.returns(true));
        sinon.replace(common, "getAllAnyResource", sinon.fake.returns(["a", "b"]));
        const result = await employeeService.getAllEmployees(filters);
        expect(result).to.be.an("array");
    });
});

describe("Test EmployeeById function", () => {
    afterEach(() => {
        sinon.restore();
    });
    it("It should return employee successfully", async () => {
        const employees = {
            employeeNumber: "19999",
            lastName: "Cao",
            firstName: "Tran",
            extension: "x5800",
            email: "caotv@gmail.com",
            officeCode: "1",
            reportsTo: null,
            jobTitle: "President",
        };
        const employeeNumber = 1222;
        const fnEmployMock = () => {
            return {
                findOne: sinon.fake.returns(employees),
            };
        };
        sinon.replace(Employee, "query", fnEmployMock);
        sinon.replace(validate, "ResByIDValidate", sinon.fake.returns(true));
        const result = await employeeService.getEmployeeById(employeeNumber);
        expect(result).to.be.an("Object");
    });
});

describe("Test getAllEmployeesBelongToOffice function", () => {
    afterEach(() => {
        sinon.restore();
    });
    it("It should return employee successfully if have filters", async () => {
        const filters = {
            employeeNumber: 123,
        };
        sinon.replace(validate, "ResArrValidate", sinon.fake.returns(true));
        sinon.replace(common, "getAllAnyResource", sinon.fake.returns(["a", "b"]));
        const result = await employeeService.getAllEmployeesBelongToOffice("1", filters);
        expect(result).to.be.an("array");
    });
});

describe("Test getAllEmployeesReportsTo function", () => {
    afterEach(() => {
        sinon.restore();
    });
    it("It should return employee successfully if have filters", async () => {
        const filters = {
            current_page: 0,
            page_size: 10,
            sort_by: "employeeNumber",
            sort_type: "ASC",
        };
        sinon.replace(validate, "ResArrValidate", sinon.fake.returns(true));
        sinon.replace(common, "getAllAnyResource", sinon.fake.returns(["a", "b"]));
        const result = await employeeService.getAllEmployeesReportsTo(1234, filters);
        expect(result).to.be.an("array");
    });
});

describe("Test getEmployeeBelongToOffice function", () => {
    afterEach(() => {
        sinon.restore();
    });
    it("It should return employee successfully", async () => {
        const employees = {
            employeeNumber: "19999",
            lastName: "Cao",
            firstName: "Tran",
            extension: "x5800",
            email: "caotv@gmail.com",
            officeCode: "1",
            reportsTo: null,
            jobTitle: "President",
        };

        const employeeNumber = 1234;
        const officeCode = 1;
        const fnMock = () => {
            return {
                findOne: sinon.fake.returns(employees),
            };
        };
        sinon.replace(Employee, "query", fnMock);
        sinon.replace(common, "checkValidEmployeeNumber", sinon.fake.returns(true));
        sinon.replace(validate, "ResByIDValidate", sinon.fake.returns(true));
        const result = await employeeService.getEmployeeBelongToOffice(employeeNumber, officeCode);
        expect(result).to.be.a("object");
    });
    it("It throw error You cannot read this employee infomation", async () => {
        const employeeNumber = 1234;
        const officeCode = 1;
        try {
            const fnMock = () => {
                return {
                    findOne: sinon.fake.returns(null),
                };
            };
            sinon.replace(Employee, "query", fnMock);
            sinon.replace(common, "checkValidEmployeeNumber", sinon.fake.returns(true));
            const result = await employeeService.getEmployeeBelongToOffice(
                employeeNumber,
                officeCode,
            );
            return result;
        } catch (error) {
            expect(error.message).to.equal("You cannot read this employee infomation");
        }
    });
});

describe("Test getEmployeeReportsTo function", () => {
    afterEach(() => {
        sinon.restore();
    });
    it("It should return employee successfully", async () => {
        const employees = {
            employeeNumber: "19999",
            lastName: "Cao",
            firstName: "Tran",
            extension: "x5800",
            email: "caotv@gmail.com",
            officeCode: "1",
            reportsTo: null,
            jobTitle: "President",
        };

        const employeeNumber = 1234;
        const officeCode = 1;
        const fnMock = () => {
            return {
                findOne: sinon.fake.returns(employees),
            };
        };
        sinon.replace(Employee, "query", fnMock);
        sinon.replace(common, "checkValidEmployeeNumber", sinon.fake.returns(true));
        sinon.replace(validate, "ResByIDValidate", sinon.fake.returns(true));
        const result = await employeeService.getEmployeeReportsTo(employeeNumber, officeCode);
        expect(result).to.be.a("object");
    });
    it("It throw error You cannot read this employee infomation", async () => {
        const employeeNumber = 1234;
        const officeCode = 1;
        try {
            const fnMock = () => {
                return {
                    findOne: sinon.fake.returns(null),
                };
            };
            sinon.replace(Employee, "query", fnMock);
            sinon.replace(common, "checkValidEmployeeNumber", sinon.fake.returns(true));
            const result = await employeeService.getEmployeeReportsTo(employeeNumber, officeCode);
            return result;
        } catch (error) {
            expect(error.message).to.equal("You cannot read this employee infomation");
        }
    });
});

describe("Test createNewEmployee function", () => {
    afterEach(() => {
        sinon.restore();
    });
    it("It will create employee successfully ", async () => {
        const employees = {
            employeeNumber: "01010",
            lastName: "Cao",
            firstName: "Tran",
            extension: "x5800",
            email: "tranvan@gmail.com",
            officeCode: "1",
            reportsTo: 1002,
            jobTitle: "President",
        };
        const fnMock = () => {
            return {
                insert: sinon.fake.returns(employees),
            };
        };
        sinon.replace(common, "checkValidReportsTo", sinon.fake.returns(true));
        sinon.replace(common, "checkDuplicateEmailCreate", sinon.fake.returns(true));
        sinon.replace(common, "checkValidOfficeCode", sinon.fake.returns(true));
        sinon.replace(Promise, "all", sinon.fake.returns(true));
        sinon.replace(Employee, "query", fnMock);
        const result = await employeeService.createNewEmployee(employees);
        expect(result).to.be.an("object");
    });
});

describe("Test Update Employee function", () => {
    afterEach(() => {
        sinon.restore();
    });
    it("It should update employee successfully", async () => {
        const employeeInfo = {
            employeeNumber: "19999",
            lastName: "Cao",
            firstName: "Tran",
            extension: "x5800",
            email: "caotv@gmail.com",
            officeCode: "1",
            reportsTo: 1002,
            jobTitle: "President",
        };
        const fnMock = () => {
            return {
                update: () => {
                    return {
                        where: sinon.fake.returns(employeeInfo),
                    };
                },
            };
        };
        sinon.replace(common, "checkValidEmployeeNumber", sinon.fake.returns(true));
        sinon.replace(common, "checkValidReportsTo", sinon.fake.returns(true));
        sinon.replace(common, "checkValidOfficeCode", sinon.fake.returns(true));
        sinon.replace(common, "checkChangeFirstNameAndLastName", sinon.fake.returns(true));
        sinon.replace(common, "checkDuplicateEmailUpdate", sinon.fake.returns(true));
        sinon.replace(Promise, "all", sinon.fake.returns(true));
        sinon.replace(Employee, "query", fnMock);
        const result = await employeeService.updateInfoEmployee(employeeInfo, 10022);
        expect(result).to.be.an("Object");
    });
});

describe("Test deleteEmployeeAdvance function", () => {
    afterEach(() => {
        sinon.restore();
    });
    it("It should throw error: EmployeeNumber is invalid or Cannot delete this employee", async () => {
        try {
            const employeeMock = () => {
                return {
                    findOne: () => {
                        return {
                            whereNot: sinon.fake.returns(null),
                        };
                    },
                };
            };

            sinon.replace(Employee, "query", employeeMock);
            await employeeService.deleteEmployeeAdvance(1652);
        } catch (error) {
            expect(error.message).to.equal(
                "employeeNumber is invalid or Cannot delete this employee",
            );
        }
    });

    it("It should delete success and return 1", async () => {
        const employee = {
            employeeNumber: 1704,
            lastName: "99999",
            firstName: "99999",
            extension: "99999",
            email: "99999of1@gmail.com",
            officeCode: "1",
            reportsTo: 1002,
            jobTitle: "Staff",
        };

        const employeeMock = () => {
            return {
                findOne: () => {
                    return {
                        whereNot: sinon.fake.returns(employee),
                    };
                },
                delete: () => {
                    return {
                        where: sinon.fake.returns(1),
                    };
                },
            };
        };

        sinon.replace(Employee, "query", employeeMock);

        const getDefaultMock = sinon.fake.returns(employee);
        sinon.replace(common, "getDefaultEmployee", getDefaultMock);

        const updateMultiMock = sinon.fake.returns(1);
        sinon.replace(customerService, "updateMutipleCustomer", updateMultiMock);

        const result = await employeeService.deleteEmployeeAdvance(1652);
        expect(result).to.equal(1);
    });
});
describe(" Test deleteEmployee ", () => {
    const employee = {
        employeeNumber: 1010,
        lastName: "Cao",
        firstName: "Tran",
        extension: "x5800",
        email: "tranvan@gmail.com",
        officeCode: "1",
        reportsTo: 10022,
        jobTitle: "President",
    };
    afterEach(() => {
        sinon.restore();
    });
    it(" it will delete successfull ", async () => {
        const wherefn = sinon.fake.returns({
            success: true,
            message: "Delete successfully",
        });
        const whereEmployeefn = {
            where: wherefn,
        };
        const deletefn = sinon.fake.returns(whereEmployeefn);
        const fnEmployeeMock = () => {
            return {
                findOne: sinon.fake.returns(null),
                delete: deletefn,
            };
        };
        sinon.replace(common, "checkValidEmployeeNumber", sinon.fake.returns(true));
        sinon.replace(Employee, "query", fnEmployeeMock);
        const result = await employeeService.deleteEmployee(employee);
        expect(result.message).to.equal("Delete successfully");
    });
    it("throw error : You cannot delete this employee!", async () => {
        try {
            const fnEmployeeMock = () => {
                return {
                    findOne: sinon.fake.returns(employee),
                };
            };
            sinon.replace(common, "checkValidEmployeeNumber", sinon.fake.returns(true));
            sinon.replace(Employee, "query", fnEmployeeMock);
            await employeeService.deleteEmployee(employee);
        } catch (error) {
            expect(error.message).to.equal("You cannot delete this employee!");
        }
    });
});

describe("Test createEmployeeAdvance function", () => {
    afterEach(() => {
        sinon.restore();
    });
    const employees = {
        employeeNumber: 1010,
        lastName: "Cao",
        firstName: "Tran",
        extension: "x5800",
        email: "tranvan@gmail.com",
        officeCode: "1",
        reportsTo: 10022,
        jobTitle: "President",
        customers: [
            {
                created_by: 1002,
            },
            {
                created_by: 1002,
            },
            {
                created_by: 1002,
            },
        ],
    };
    const created_by = 1022;
    it("it will create many employee", async () => {
        sinon.replace(common, "checkValidReportsTo", sinon.fake.returns(true));
        sinon.replace(common, "checkDuplicateEmailCreate", sinon.fake.returns(true));
        sinon.replace(common, "checkValidOfficeCode", sinon.fake.returns(true));
        sinon.replace(Promise, "all", sinon.fake.returns(true));
        sinon.replace(Employee, "transaction", sinon.fake.returns(employees));
        const result = await employeeService.createEmployeeAdvance(employees, created_by);
        expect(result).to.be.an("object");
    });
});

describe("Test updateInfoEmployeeBelongToOffice ", () => {
    afterEach(() => {
        sinon.restore();
    });
    const employeeNumber = 19999;

    const employeeInfo = {
        employeeNumber: 19999,
        lastName: "Cao1",
        firstName: "Tran1",
        extension: "x5800",
        email: "caotv@gmail.com",
        officeCode: "1",
        reportsTo: 1002,
        jobTitle: "President",
    };
    it("it will update employee belong to office ", async () => {
        sinon.replace(common, "checkValidEmployeeNumber", sinon.fake.returns({ officeCode: "1" }));
        sinon.replace(common, "checkValidReportsTo", sinon.fake.returns(true));
        sinon.replace(common, "checkValidOfficeCode", sinon.fake.returns(true));
        const fnEmployeeMock = () => {
            return {
                update: () => {
                    return {
                        where: sinon.fake.returns(employeeInfo),
                    };
                },
            };
        };
        sinon.replace(Employee, "query", fnEmployeeMock);
        const result = await employeeService.updateInfoEmployeeBelongToOffice(
            employeeInfo,
            employeeNumber,
        );
        expect(result).to.be.an("object");
    });
    it("it will throw error You cannot change officeCode", async () => {
        const employee = {
            employeeNumber: "19989",
            lastName: "Cao",
            firstName: "Tran",
            extension: "x5800",
            email: "caotv@gmail.com",
            officeCode: "2",
            reportsTo: 1002,
            jobTitle: "President",
        };
        try {
            sinon.replace(common, "checkValidEmployeeNumber", sinon.fake.returns(employee));
            sinon.replace(common, "checkValidReportsTo", sinon.fake.returns(true));
            sinon.replace(common, "checkValidOfficeCode", sinon.fake.returns(true));
            await employeeService.updateInfoEmployeeBelongToOffice(employeeInfo, employee);
        } catch (error) {
            expect(error.message).to.equal("You cannot change officeCode");
        }
    });
});
