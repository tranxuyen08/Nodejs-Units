const { expect } = require("chai");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const knex = require("knex");
const bcrypt = require("bcryptjs");
const { assert } = require("chai");
const { development } = require("../../knexfile");
const Employee = require("../../models/employee.model");
const Customer = require("../../models/customer.model");
const UserCustomer = require("../../models/usercustomer.model");
const Office = require("../../models/office.model");
const Order = require("../../models/orders.model");
const Product = require("../../models/products.model");
const ProductLine = require("../../models/productlines.model");
const User = require("../../models/user.model");
const common = require("../../utils/common");

const db = knex(development);

describe("Test hashPassword function", () => {
    afterEach(() => {
        sinon.restore();
    });
    it("It should return hashPassword like : $2a$08$PLpPOVO6", async () => {
        const password = "12345";
        const mockSalt = sinon.fake.returns(8);
        sinon.replace(bcrypt, "genSalt", mockSalt);

        const hashMock = sinon.fake.returns(password);
        sinon.replace(bcrypt, "hash", hashMock);
        const result = await common.hashPassword("12345");

        assert(mockSalt.calledWith(8));
        assert.equal(hashMock.callCount, 1);
        assert(hashMock.calledWith(password));
        expect(result).to.be.a("string");
    });

    it("It should throw error : Password must be string", async () => {
        try {
            await common.hashPassword(12345);
            assert.fail("Failed");
        } catch (error) {
            expect(error.message).to.equal("Password must be string");
        }
    });
});

describe("test isPasswordValid function", () => {
    afterEach(() => {
        sinon.restore();
    });
    it("it will throw error if password is number type", async () => {
        try {
            const password = 12345;
            common.isPasswordValid(password);
        } catch (error) {
            expect(error.message).to.equal("Password must be string");
        }
    });
    it("should return true", async () => {
        const password = "12345";
        const hardpassword = "udfhasjxnashasfcasdasd";
        const compareMock = sinon.fake.returns(true);
        sinon.replace(bcrypt, "compare", compareMock);
        const result = await common.isPasswordValid(password, hardpassword);
        assert(compareMock.calledWith(password, hardpassword));
        expect(result).to.be.true;
    });
});

describe("test function generateToken", () => {
    afterEach(() => {
        sinon.restore();
    });
    it(" it will be throw error if user do not have employees property", async () => {
        try {
            const user = {
                username: "hoa1234567",
                password: "$2a$08$dsgjwf2rF4ouialvkztBV.qe519SV0WQgQece3DHEabWfqROxohD2",
                employeeNumber: 1002,
                employees: {},
            };
            await common.generateTokenUser(user);
            assert.fail("User info is invalid");
        } catch (error) {
            expect(error.message).to.equal("User info is invalid");
        }
    });
    it("it will be return token successfully !", async () => {
        const user = {
            username: "test",
            password: "12345",
            employees: {
                employeeNumber: 1008,
                officeCode: 7,
                jobTitle: "Leader",
            },
        };
        const { employeeNumber, officeCode, jobTitle } = user.employees;
        const signMock = sinon.fake.returns("this is a token");
        sinon.replace(jwt, "sign", signMock);
        const result = await common.generateTokenUser(user);
        assert(signMock.calledWith({ employeeNumber, officeCode, jobTitle }));
        expect(result).to.equal("this is a token");
    });
});

describe("test function generateTokenUserCustomer", () => {
    afterEach(() => {
        sinon.restore();
    });
    it(" it will be throw error : User info is invalid", async () => {
        try {
            const user = {
                username: "thanhtv",
                password: "$2a$08$dsgjwf2rF4ouialvkztBV.qe519SV0WQgQece3DHEabWfqROxohD2",
                customers: {},
            };
            const token = await common.generateTokenUserCustomer(user);
            return token;
        } catch (error) {
            expect(error.message).to.equal("User info is invalid");
        }
    });
    it("it will be return token successfully !", async () => {
        const user = {
            username: "test",
            password: "12345",
            customers: {
                customerNumber: 102,
                salesRepEmployeeNumber: 108,
            },
        };
        const signMock = sinon.fake.returns("this is a token");
        sinon.replace(jwt, "sign", signMock);
        const token = await common.generateTokenUserCustomer(user);
        expect(token).to.equal("this is a token");
        return token;
    });
});

describe("test getUserByUsername function", async () => {
    afterEach(() => {
        sinon.restore();
    });
    it("it will  return User succesfully", async () => {
        const user = {
            username: "test",
            password: "12345",
            employees: {
                employeeNumber: 1008,
                officeCode: 7,
                jobTitle: "Leader",
            },
        };

        const fnMock = () => {
            return {
                findOne: () => {
                    return { withGraphFetched: sinon.fake.returns(user) };
                },
            };
        };
        sinon.replace(User, "query", fnMock);
        const result = await common.getUserByUsername("User", user.username);
        expect(result).to.be.an("object");
    });
    it("it will  return UserCustomer succesfully", async () => {
        const user = {
            username: "test",
            password: "12345",
            employees: {
                employeeNumber: 1008,
                officeCode: 7,
                jobTitle: "Leader",
            },
        };

        const fnMock = () => {
            return {
                findOne: () => {
                    return { withGraphFetched: sinon.fake.returns(user) };
                },
            };
        };
        sinon.replace(UserCustomer, "query", fnMock);
        const result = await common.getUserByUsername("UserCustomer", user.username);
        expect(result).to.be.an("object");
    });
    it("it will  throw error", async () => {
        try {
            const user = {
                username: "test",
                password: "12345",
                employees: {
                    employeeNumber: 1008,
                    officeCode: 7,
                    jobTitle: "Leader",
                },
            };
            const fnMock = () => {
                return {
                    findOne: () => {
                        return { withGraphFetched: sinon.fake.returns(null) };
                    },
                };
            };
            sinon.replace(UserCustomer, "query", fnMock);
            await common.getUserByUsername("UserCustomer", user.username);
        } catch (error) {
            expect(error.message).to.equal("Could not find username");
        }
    });
});

describe("Test checkDuplicateEmailCreate function", () => {
    const employee = {
        employeeNumber: 19999,
        lastName: "Cao",
        firstName: "Tran",
        extension: "x5800",
        email: "caotv@gmail.com",
        officeCode: "1",
        reportsTo: null,
        jobTitle: "President",
    };
    afterEach(() => {
        sinon.restore();
    });
    it("it will be successful ", async () => {
        const isDuplicateEmailMock = () => {
            return {
                findOne: sinon.fake.returns(null),
            };
        };
        sinon.replace(Employee, "query", isDuplicateEmailMock);
        const result = await common.checkDuplicateEmailCreate(employee.email);
        expect(result).to.be.null;
    });
    it("it will throw error : Email cannot be dupplicate", async () => {
        try {
            const isDuplicateEmailMock = () => {
                return {
                    findOne: sinon.fake.returns(employee),
                };
            };
            sinon.replace(Employee, "query", isDuplicateEmailMock);
            const result = await common.checkDuplicateEmailCreate(employee.email);
            return result;
        } catch (error) {
            expect(error.message).to.equal("Email cannot be dupplicate");
        }
    });
});

describe("Test checkDuplicateEmailUpdate function", () => {
    const employee = {
        employeeNumber: 19999,
        lastName: "Cao",
        firstName: "Tran",
        extension: "x5800",
        email: "caotv@gmail.com",
        officeCode: "1",
        reportsTo: null,
        jobTitle: "President",
    };
    const { email, employeeNumber } = employee;
    afterEach(() => {
        sinon.restore();
    });
    it("it will be successful ", async () => {
        const isDuplicateEmailMock = () => {
            return {
                findOne: () => {
                    return {
                        whereNot: sinon.fake.returns(null),
                    };
                },
            };
        };
        sinon.replace(Employee, "query", isDuplicateEmailMock);
        const result = await common.checkDuplicateEmailUpdate(email, employeeNumber);
        expect(result).to.be.null;
    });
    it("it will throw error : Email cannot be dupplicate", async () => {
        try {
            const isDuplicateEmailMock = () => {
                return {
                    findOne: () => {
                        return {
                            whereNot: sinon.fake.returns(employee),
                        };
                    },
                };
            };
            sinon.replace(Employee, "query", isDuplicateEmailMock);
            const result = await common.checkDuplicateEmailUpdate(email, employeeNumber);
            return result;
        } catch (error) {
            expect(error.message).to.equal("Email cannot be dupplicate");
        }
    });
});

describe("Test checkDuplicateUserName function", () => {
    afterEach(() => {
        sinon.restore();
    });
    it("it will be successful with user ", async () => {
        const checkDuplicateUserMock = () => {
            return {
                findOne: sinon.fake.returns(null),
            };
        };
        sinon.replace(User, "query", checkDuplicateUserMock);
        const result = await common.checkDuplicateUserName("tttt", "User");
        expect(result).to.be.null;
    });
    it("it will be successful with userCustomer ", async () => {
        const checkDuplicateUserCustomerMock = () => {
            return {
                findOne: sinon.fake.returns(null),
            };
        };
        sinon.replace(UserCustomer, "query", checkDuplicateUserCustomerMock);
        const result = await common.checkDuplicateUserName("tttt", "UserCustomer");
        expect(result).to.be.null;
    });
    it("it will throw error : Username is already exist! with user", async () => {
        try {
            const checkDuplicateUser = () => {
                return {
                    findOne: sinon.fake.returns(true),
                };
            };
            sinon.replace(User, "query", checkDuplicateUser);
            const result = await common.checkDuplicateUserName("tttt", "User");
            return result;
        } catch (error) {
            expect(error.message).to.equal("Username is already exist!");
        }
    });
    it("it will throw error : Username is already exist! with userCustomer", async () => {
        try {
            const checkDuplicateUserCustomerMock = () => {
                return {
                    findOne: sinon.fake.returns(true),
                };
            };
            sinon.replace(UserCustomer, "query", checkDuplicateUserCustomerMock);
            const result = await common.checkDuplicateUserName("tttt", "UserCustomer");
            return result;
        } catch (error) {
            expect(error.message).to.equal("Username is already exist!");
        }
    });
});

describe("Test checkDuplicateOfficeCode function", () => {
    afterEach(() => {
        sinon.restore();
    });
    it("it will be successful ", async () => {
        const isDuplicateOfficeCode = () => {
            return {
                findOne: sinon.fake.returns(null),
            };
        };
        sinon.replace(Office, "query", isDuplicateOfficeCode);
        const result = await common.checkDuplicateOfficeCode("1");
        expect(result).to.be.null;
    });
    it("it will throw error : Email cannot be dupplicate", async () => {
        try {
            const isDuplicateOfficeCode = () => {
                return {
                    findOne: sinon.fake.returns({ officeCode: "1" }),
                };
            };
            sinon.replace(Office, "query", isDuplicateOfficeCode);
            const result = await common.checkDuplicateOfficeCode("1");
            return result;
        } catch (error) {
            expect(error.message).to.equal("officeCode cannot be dupplicate");
        }
    });
});

describe("Test checkValidReportsTo function", () => {
    afterEach(() => {
        sinon.restore();
    });
    const employee = [
        {
            employeeNumber: 19999,
            lastName: "Cao",
            firstName: "Tran",
            extension: "x5800",
            email: "caotv@gmail.com",
            officeCode: "1",
            reportsTo: null,
            jobTitle: "President",
        },
        {
            employeeNumber: 19999,
            lastName: "Cao",
            firstName: "Tran",
            extension: "x5800",
            email: "caotv@gmail.com",
            officeCode: "1",
            reportsTo: null,
            jobTitle: "President",
        },
    ];
    it("it will be successful ", async () => {
        const checkValidReportsToMock = () => {
            return {
                where: sinon.fake.returns(employee),
            };
        };
        sinon.replace(Employee, "query", checkValidReportsToMock);
        const result = await common.checkValidReportsTo(1002);
        expect(result).to.be.an("array");
    });
    it("it will throw error : ReportsTo is invalid", async () => {
        try {
            const checkValidReportsToMock = () => {
                return {
                    where: sinon.fake.returns([]),
                };
            };
            sinon.replace(Employee, "query", checkValidReportsToMock);
            const result = await common.checkValidReportsTo(1002);
            return result;
        } catch (error) {
            expect(error.message).to.equal("ReportsTo is invalid");
        }
    });
});

describe("Test checkValidOfficeCode function", () => {
    afterEach(() => {
        sinon.restore();
    });
    it("it will be successful ", async () => {
        const checkValidOfficeCode = () => {
            return {
                findOne: sinon.fake.returns(true),
            };
        };
        sinon.replace(Office, "query", checkValidOfficeCode);
        const result = await common.checkValidOfficeCode("1");
        expect(result).to.be.true;
    });
    it("it will throw error : OfficeCode is invalid", async () => {
        try {
            const checkValidOfficeCode = () => {
                return {
                    findOne: sinon.fake.returns(null),
                };
            };
            sinon.replace(Office, "query", checkValidOfficeCode);
            const result = await common.checkValidOfficeCode("1");
            return result;
        } catch (error) {
            expect(error.message).to.equal("OfficeCode is invalid");
        }
    });
});

describe("Test checkValidEmployeeNumber function", () => {
    afterEach(() => {
        sinon.restore();
    });
    const employee = {
        employeeNumber: 19999,
        lastName: "Cao",
        firstName: "Tran",
        extension: "x5800",
        email: "caotv@gmail.com",
        officeCode: "1",
        reportsTo: null,
        jobTitle: "President",
    };
    it("it will be successful ", async () => {
        const checkValidEmployeeNumberMock = () => {
            return {
                findOne: sinon.fake.returns(employee),
            };
        };
        sinon.replace(Employee, "query", checkValidEmployeeNumberMock);
        const result = await common.checkValidEmployeeNumber(19999);
        expect(result).to.be.an("object");
    });
    it("it will throw error :employeeNumber is invalid", async () => {
        try {
            const checkValidEmployeeNumberMock = () => {
                return {
                    findOne: sinon.fake.returns(null),
                };
            };
            sinon.replace(Employee, "query", checkValidEmployeeNumberMock);
            const result = await common.checkValidEmployeeNumber(1111);
            return result;
        } catch (error) {
            expect(error.message).to.equal("employeeNumber is invalid");
        }
    });
});

describe("Test checkDuplicateUniqueField function", () => {
    afterEach(() => {
        sinon.restore();
    });
    it("it will be successful with user ", async () => {
        const checkDuplicateUniqueFieldMOck = () => {
            return {
                findOne: sinon.fake.returns(null),
            };
        };
        sinon.replace(User, "query", checkDuplicateUniqueFieldMOck);
        const result = await common.checkDuplicateUniqueField(123, "User");
        expect(result).to.be.null;
    });
    it("it will be successful with userCustomer ", async () => {
        const checkDuplicateUniqueFieldMOck = () => {
            return {
                findOne: sinon.fake.returns(null),
            };
        };
        sinon.replace(UserCustomer, "query", checkDuplicateUniqueFieldMOck);
        const result = await common.checkDuplicateUniqueField(123, "UserCustomer");
        expect(result).to.be.null;
    });
    it("it will throw error :You cannot create more account with user", async () => {
        try {
            const checkDuplicateUniqueFieldMOck = () => {
                return {
                    findOne: sinon.fake.returns({ a: 11 }),
                };
            };
            sinon.replace(User, "query", checkDuplicateUniqueFieldMOck);
            const result = await common.checkDuplicateUniqueField("tttt", "User");
            return result;
        } catch (error) {
            expect(error.message).to.equal("You cannot create more account");
        }
    });
    it("it will throw error : You cannot create more account with userCustomer", async () => {
        try {
            const checkDuplicateUniqueFieldMOck = () => {
                return {
                    findOne: sinon.fake.returns({ a: 11 }),
                };
            };
            sinon.replace(UserCustomer, "query", checkDuplicateUniqueFieldMOck);
            const result = await common.checkDuplicateUniqueField("tttt", "UserCustomer");
            return result;
        } catch (error) {
            expect(error.message).to.equal("You cannot create more account");
        }
    });
});

describe("Test checkCustomerRelateToOrder function", () => {
    afterEach(() => {
        sinon.restore();
    });

    it("it will be successful ", async () => {
        const checkCustomerRelateToOrderMock = () => {
            return {
                where: sinon.fake.returns([]),
            };
        };
        sinon.replace(Order, "query", checkCustomerRelateToOrderMock);
        const result = await common.checkCustomerRelateToOrder(19999);
        expect(result).to.be.a("array");
    });
    it("it will throw error : This customer cannot be delete!", async () => {
        try {
            const checkCustomerRelateToOrderMock = () => {
                return {
                    where: sinon.fake.returns([1, 2]),
                };
            };
            sinon.replace(Order, "query", checkCustomerRelateToOrderMock);
            const result = await common.checkCustomerRelateToOrder(1111);
            return result;
        } catch (error) {
            expect(error.message).to.equal("This customer cannot be delete!");
        }
    });
});

describe("Test checkValidCustomerNumber function", () => {
    afterEach(() => {
        sinon.restore();
    });

    it("it will be successful ", async () => {
        const checkValidCustomerNumber = () => {
            return {
                findOne: sinon.fake.returns(["a", "b"]),
            };
        };
        sinon.replace(Customer, "query", checkValidCustomerNumber);
        const result = await common.checkValidCustomerNumber(19999);
        expect(result).to.be.a("array");
    });
    it("it will throw error : customerNumber is invalid", async () => {
        try {
            const checkValidCustomerNumber = () => {
                return {
                    findOne: sinon.fake.returns(null),
                };
            };
            sinon.replace(Customer, "query", checkValidCustomerNumber);
            const result = await common.checkValidCustomerNumber(1111);
            return result;
        } catch (error) {
            expect(error.message).to.equal("customerNumber is invalid");
        }
    });
});

describe("Test random8Character function", () => {
    it("it will be reutn 8Character", () => {
        const result = common.random8Character();
        expect(result).to.be.a("string");
    });
});

describe("Test checkChangeFirstNameAndLastName function", () => {
    afterEach(() => {
        sinon.restore();
    });
    const employee = {
        employeeNumber: 19999,
        lastName: "Cao",
        firstName: "Tran",
        extension: "x5800",
        email: "caotv@gmail.com",
        officeCode: "1",
        reportsTo: null,
        jobTitle: "President",
    };
    const employeeDB = {
        employeeNumber: 19999,
        lastName: "Cao",
        firstName: "Tran",
        extension: "x5800",
        email: "caotv@gmail.com",
        officeCode: "1",
        reportsTo: null,
        jobTitle: "President",
    };
    it("it will be successful ", async () => {
        const checkChangeFirstNameAndLastNameMock = () => {
            return {
                findOne: sinon.fake.returns(employeeDB),
            };
        };
        sinon.replace(Employee, "query", checkChangeFirstNameAndLastNameMock);
        const result = await common.checkChangeFirstNameAndLastName(employee, 19999);
        expect(result).to.be.a("object");
    });
    it("it will throw error :LastName or FirstName can not change", async () => {
        const employeeDBs = {
            employeeNumber: 19999,
            lastName: "Caott",
            firstName: "Trantt",
            extension: "x5800",
            email: "caotv@gmail.com",
            officeCode: "1",
            reportsTo: null,
            jobTitle: "President",
        };
        try {
            const checkChangeFirstNameAndLastNameMock = () => {
                return {
                    findOne: sinon.fake.returns(employeeDBs),
                };
            };
            sinon.replace(Employee, "query", checkChangeFirstNameAndLastNameMock);
            const result = await common.checkChangeFirstNameAndLastName(employee, 19999);
            return result;
        } catch (error) {
            expect(error.message).to.equal("LastName or FirstName can not change");
        }
    });
});

describe("Test checkValidProductCode function", () => {
    afterEach(() => {
        sinon.restore();
    });
    it("it will be successful ", async () => {
        const checkValidProductCodeMock = () => {
            return {
                findOne: sinon.fake.returns({ a: 1 }),
            };
        };
        sinon.replace(Product, "query", checkValidProductCodeMock);
        const result = await common.checkValidProductCode("hn1568");
        expect(result).to.be.an("object");
    });
    it("it will throw error :productCode has already exist!", async () => {
        try {
            const checkValidProductCodeMock = () => {
                return {
                    findOne: sinon.fake.returns(null),
                };
            };
            sinon.replace(Product, "query", checkValidProductCodeMock);
            const result = await common.checkValidProductCode("hn1568");
            return result;
        } catch (error) {
            expect(error.message).to.equal("productCode is invalid!");
        }
    });
});

describe("Test checkDuplicateProductLine function", () => {
    afterEach(() => {
        sinon.restore();
    });
    it("it will be successful ", async () => {
        const isProductLineMock = () => {
            return {
                findOne: sinon.fake.returns(null),
            };
        };
        sinon.replace(Product, "query", isProductLineMock);
        const result = await common.checkDuplicateProductLine("hn1568");
        expect(result).to.be.null;
    });
    it("it will throw error : productLine has already exist!", async () => {
        try {
            const isProductLineMock = () => {
                return {
                    findOne: sinon.fake.returns(true),
                };
            };
            sinon.replace(Product, "query", isProductLineMock);
            const result = await common.checkDuplicateProductLine("hn1568");
            return result;
        } catch (error) {
            expect(error.message).to.equal("productLine has already exist!");
        }
    });
});

describe("Test checkDuplicateProductCode function", () => {
    afterEach(() => {
        sinon.restore();
    });
    it("it will be successful ", async () => {
        const checkDuplicateProductCode = () => {
            return {
                findOne: sinon.fake.returns(null),
            };
        };
        sinon.replace(Product, "query", checkDuplicateProductCode);
        const result = await common.checkDuplicateProductCode("1");
        expect(result).to.be.null;
    });
    it("it will throw error : productCode has already exist!", async () => {
        try {
            const checkDuplicateProductCode = () => {
                return {
                    findOne: sinon.fake.returns(true),
                };
            };
            sinon.replace(Product, "query", checkDuplicateProductCode);
            const result = await common.checkDuplicateProductCode("1");
            return result;
        } catch (error) {
            expect(error.message).to.equal("productCode has already exist!");
        }
    });
});

describe("Test checkValidOrderNumber function", () => {
    afterEach(() => {
        sinon.restore();
    });
    it("it will be successful ", async () => {
        const isValidOrderNumber = () => {
            return {
                findOne: sinon.fake.returns({ orderNumber: 1111 }),
            };
        };
        sinon.replace(Order, "query", isValidOrderNumber);
        const result = await common.checkValidOrderNumber("hn1568");
        expect(result).to.be.an("object");
    });
    it("it will throw error : productLine has already exist!", async () => {
        try {
            const isValidOrderNumber = () => {
                return {
                    findOne: sinon.fake.returns(null),
                };
            };
            sinon.replace(Order, "query", isValidOrderNumber);
            const result = await common.checkValidOrderNumber("hn1568");
            return result;
        } catch (error) {
            expect(error.message).to.equal("orderNumber is invalid!");
        }
    });
});

describe("Test checkValidProductLine function", () => {
    afterEach(() => {
        sinon.restore();
    });
    it("it will be successful ", async () => {
        const isProductLineMOck = () => {
            return {
                findOne: sinon.fake.returns({ productLine: 1111 }),
            };
        };
        sinon.replace(ProductLine, "query", isProductLineMOck);
        const result = await common.checkValidProductLine("hn1568");
        expect(result).to.be.an("object");
    });
    it("it will throw error : productLine is invalid!", async () => {
        try {
            const isProductLineMOck = () => {
                return {
                    findOne: sinon.fake.returns(null),
                };
            };
            sinon.replace(ProductLine, "query", isProductLineMOck);
            const result = await common.checkValidProductLine("hn1568");
            return result;
        } catch (error) {
            expect(error.message).to.equal("productLine is invalid!");
        }
    });
});

describe("Test totalBill", () => {
    it("it will true", () => {
        const array = [
            {
                quantityOrdered: 1,
                priceEach: 2,
            },
            {
                quantityOrdered: 1,
                priceEach: 2,
            },
            {
                quantityOrdered: 1,
                priceEach: 2,
            },
        ];
        const total = common.totalBill(array);
        expect(total).to.equal(6);
    });
});

describe("Test getTotalAmountProcess", () => {
    afterEach(() => {
        sinon.restore();
    });
    it("it will get successfully", async () => {
        const fnMock = () => {
            return {
                where: () => {
                    return {
                        whereNotIn: () => {
                            return {
                                withGraphFetched: () => {
                                    return {
                                        modifiers: sinon.fake.returns([
                                            {
                                                a: 123,
                                                orderdetails: [
                                                    { "sum(quantityOrdered * priceEach)": 123 },
                                                ],
                                            },
                                            {
                                                b: 123,
                                                orderdetails: [
                                                    { "sum(quantityOrdered * priceEach)": 123 },
                                                ],
                                            },
                                        ]),
                                    };
                                },
                            };
                        },
                    };
                },
            };
        };
        sinon.replace(Order, "query", fnMock);
        const result = await common.getTotalAmountProcess(123);
        expect(result).to.equal(246);
    });
});

describe("Test getTotalAmount", () => {
    afterEach(() => {
        sinon.restore();
    });
    it("it will get successfully", async () => {
        const fnMock = () => {
            return {
                findOne: () => {
                    return {
                        withGraphFetched: () => {
                            return {
                                modifiers: sinon.fake.returns({
                                    a: 123,
                                    orderdetails: [{ "sum(quantityOrdered * priceEach)": 123 }],
                                }),
                            };
                        },
                    };
                },
            };
        };
        sinon.replace(Order, "query", fnMock);
        const result = await common.getTotalAmount(123);
        expect(result).to.equal(123);
    });
});

describe("Test getDefaultEmployee", () => {
    it("check sucessfully", async () => {
        sinon.replace(
            Employee,
            "query",
            sinon.fake.returns({
                findOne: sinon.fake.returns({ lastName: "99999", officeCode: "1" }),
            }),
        );
        const result = await common.getDefaultEmployee("1");
        expect(result).to.be.an("object");
    });
});

describe("Test getAllAnyResource", () => {
    it("It should return arr", async () => {
        const initialQuery = [
            `SELECT * FROM FA_NODEJS.orders where orderDate between "2003-01-09" and "2021-12-09"`,
        ];
        const filter = {
            orderNumber: 1234,
        };
        const sort_by = "orderNumber";
        const sort_type = "ASC";
        const page_size = 10;
        const current_page = 0;
        const result = await common.getAllAnyResource(
            initialQuery,
            filter,
            sort_by,
            sort_type,
            page_size,
            current_page,
        );
        sinon.stub(db, "raw").returns([]);
        expect(result).to.be.an("array");
    });
});
