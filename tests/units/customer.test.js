const { expect } = require("chai");
const sinon = require("sinon");
const moment = require("moment");
const customerService = require("../../services/customers.service");
const Customer = require("../../models/customer.model");
const Order = require("../../models/orders.model");
const common = require("../../utils/common");
const Payment = require("../../models/payment.model");

describe("Test getAllCustomers function", () => {
    const customers = [
        {
            customerNumber: 103,
            customerName: "Atelier graphique",
            contactLastName: "Schemits",
            contactFirstName: "Carine ",
            phone: "40234234",
            addressLine1: "54, rue Royale",
            addressLine2: null,
            city: "Ha Noi",
            state: null,
            postalCode: "44000",
            country: "France",
            salesRepEmployeeNumber: 1621,
            creditLimit: 21000,
        },
        {
            customerNumber: 112,
            customerName: "Signal Gift Stores",
            contactLastName: "King",
            contactFirstName: "Jean",
            phone: "7025551838",
            addressLine1: "8489 Strong St.",
            addressLine2: null,
            city: "Ha Noi",
            state: "NV",
            postalCode: "83030",
            country: "USA",
            salesRepEmployeeNumber: 1166,
            creditLimit: 71800,
        },
    ];

    afterEach(() => {
        sinon.restore();
    });
    it("It should return array with attr & filters", async () => {
        const filters = {
            filters: {
                salesRepEmployeeNumber: 1621,
                city: "Ha Noi",
            },
        };
        const mock = sinon.fake.returns(customers);
        sinon.replace(common, "getAllAnyResource", mock);
        const result = await customerService.getAllCustomers(filters);
        expect(result).to.be.an("array");
    });

    it("It should return array without filter", async () => {
        const filters = {
            filters: {},
        };
        const mock = sinon.fake.returns(customers);
        sinon.replace(common, "getAllAnyResource", mock);
        const result = await customerService.getAllCustomers(filters);
        expect(result).to.be.an("array");
    });
});

describe("Test getCustomerById function", () => {
    const customers = {
        customerNumber: 398,
        customerName: "Tokyo Collectables, Ltd",
        contactLastName: "Shimamura",
        contactFirstName: "Akiko",
        phone: "+81 3 3584 0555",
        addressLine1: "2-2-8 Roppongi",
        addressLine2: null,
        city: "Minato-ku",
        state: "Tokyo",
        postalCode: "106-0032",
        country: "Japan",
        salesRepEmployeeNumber: 1621,
        creditLimit: 94400,
    };
    before(() => {
        sinon.restore();
    });
    afterEach(() => {
        sinon.restore();
    });
    it("It should return object", async () => {
        const customerMock = () => {
            return {
                findOne: sinon.fake.returns(customers),
            };
        };

        sinon.replace(Customer, "query", customerMock);
        sinon.replace(common, "checkValidCustomerNumber", sinon.fake.returns(true));
        const result = await customerService.getCustomerById(1721);
        expect(result).to.be.an("object");
    });
});

describe("Test createNewCustomer function", () => {
    afterEach(() => {
        sinon.restore();
    });
    it("it will create employee successfully ", async () => {
        const customer = {
            customerNumber: 398,
            customerName: "Tokyo Collectables, Ltd",
            contactLastName: "Shimamura",
            contactFirstName: "Akiko",
            phone: "+81 3 3584 0555",
            addressLine1: "2-2-8 Roppongi",
            addressLine2: null,
            city: "Minato-ku",
            state: "Tokyo",
            postalCode: "106-0032",
            country: "Japan",
            salesRepEmployeeNumber: 1621,
            creditLimit: 94400,
        };
        const insertCusotmerfn = sinon.fake.returns(customer);
        const funcCustomerMock = () => {
            return {
                insert: insertCusotmerfn,
            };
        };
        sinon.replace(Customer, "query", funcCustomerMock);
        sinon.replace(common, "checkValidEmployeeNumber", sinon.fake.returns(true));
        const result = await customerService.createNewCustomer(customer);
        expect(result).to.be.an("object");
    });
});

describe("Test updateInfoCustomer function", () => {
    afterEach(() => {
        sinon.restore();
    });
    it("it will update info of customer", async () => {
        const updatecustomer = {
            customerNumber: 398,
            customerName: "Tokyo Collectables, Ltd",
            contactLastName: "Shimamura",
            contactFirstName: "Akiko",
            phone: "+81 3 3584 0555",
            addressLine1: "2-2-8 Roppongi",
            addressLine2: null,
            city: "Minato-ku",
            state: "Tokyo",
            postalCode: "106-0032",
            country: "Japan",
            salesRepEmployeeNumber: 1621,
            creditLimit: 94400,
        };
        const customerNumber = 398;
        const wherefn = sinon.fake.returns(updatecustomer);
        const wherecustomerfn = {
            where: wherefn,
        };
        const updateCustomer = sinon.fake.returns(wherecustomerfn);
        const funcCustomerMock = () => {
            return {
                update: updateCustomer,
            };
        };
        sinon.replace(Customer, "query", funcCustomerMock);
        sinon.replace(common, "checkValidCustomerNumber", sinon.fake.returns(true));
        sinon.replace(common, "checkValidEmployeeNumber", sinon.fake.returns(true));
        const result = await customerService.updateInfoCustomer(updatecustomer, customerNumber);
        expect(result).to.be.an("object");
        expect(result.customerName).to.equal("Tokyo Collectables, Ltd");
    });
});

describe("Test updateMutipleCustomer function", () => {
    afterEach(() => {
        sinon.restore();
    });
    const condition = { salesRepEmployeeNumber: 5555 };
    const employeeNumber = 1345;
    const arrayCustomer = [
        {
            customerNumber: 398,
            customerName: "Tokyo ",
            contactLastName: "Shimamura",
            contactFirstName: "Akiko",
            phone: "+81 3 3584 0555",
            addressLine1: "2-2-8 newyork",
            addressLine2: null,
            city: "Minato-ku",
            state: "Tokyo",
            postalCode: "106-0032",
            country: "Japan",
            salesRepEmployeeNumber: 1621,
            creditLimit: 94400,
        },
        {
            customerNumber: 405,
            customerName: "Tokyo Shimamura",
            contactLastName: "Shimamura",
            contactFirstName: "Akiko",
            phone: "+81 3 3584 0555",
            addressLine1: "2-2-8 newyork",
            addressLine2: null,
            city: "Minato-ku",
            state: "Tokyo",
            postalCode: "106-0032",
            country: "Japan",
            salesRepEmployeeNumber: 1661,
            creditLimit: 94400,
        },
    ];
    it("it will update mutiple", async () => {
        const funcCustomerMock = () => {
            return {
                select: () => {
                    return {
                        where: sinon.fake.returns(arrayCustomer),
                    };
                },
                patch: () => {
                    return {
                        whereIn: sinon.fake.returns(arrayCustomer),
                    };
                },
            };
        };
        sinon.replace(Customer, "query", funcCustomerMock);
        const result = await customerService.updateMutipleCustomer(condition, employeeNumber);
        expect(result).to.be.a("array");
    });
    it("it will throw error : Can not update customers !", async () => {
        try {
            const funcCustomerMock = () => {
                return {
                    select: () => {
                        return {
                            where: sinon.fake.returns(arrayCustomer),
                        };
                    },
                    patch: () => {
                        return {
                            whereIn: sinon.fake.returns(null),
                        };
                    },
                };
            };
            sinon.replace(Customer, "query", funcCustomerMock);
            await customerService.updateMutipleCustomer(condition, employeeNumber);
        } catch (error) {
            expect(error.message).to.equal("Can not update customers!");
        }
    });
});

describe("Test deleteCustomer function", () => {
    afterEach(() => {
        sinon.restore();
    });
    const customerNumber = 389;
    it("it will delet sucessfully", async () => {
        const wherefn = sinon.fake.returns({
            success: true,
            message: "Delete successfully",
        });
        const wherecustomerfn = {
            where: wherefn,
        };
        const deletefn = sinon.fake.returns(wherecustomerfn);
        const funcCustomerMock = () => {
            return {
                delete: deletefn,
            };
        };
        sinon.replace(common, "checkValidCustomerNumber", sinon.fake.returns(true));
        sinon.replace(common, "checkCustomerRelateToOrder", sinon.fake.returns(true));
        sinon.replace(Customer, "query", funcCustomerMock);
        const result = await customerService.deleteCustomer(customerNumber);
        expect(result.message).to.equal("Delete successfully");
    });
});

describe("Test getPaymentForCustomer", () => {
    const payment = [
        {
            checkNumber: "HQ336336",
            orderNumber: 10123,
            paymentDate: "2004-10-18T17:00:00.000Z",
            amount: 6066.78,
            created_on: "2021-12-04T10:08:32.000Z",
        },
        {
            checkNumber: "JM555205",
            orderNumber: 10298,
            paymentDate: "2003-06-04T17:00:00.000Z",
            amount: 14571.44,
            created_on: "2021-12-04T10:08:32.000Z",
        },
        {
            checkNumber: "OM314933",
            orderNumber: 10345,
            paymentDate: "2004-12-17T17:00:00.000Z",
            amount: 1676.14,
            created_on: "2021-12-04T10:08:32.000Z",
        },
    ];
    it("it will return list payment", async () => {
        sinon.stub(Payment, "query").returns({
            select: sinon.stub().returnsThis(),
            from: sinon.stub().returnsThis(),
            join: sinon.stub().returnsThis(),
            where: sinon.stub().returnsThis(),
            groupBy: sinon.stub().returns(payment),
        });
        const order = [{ orderNumber: 10123 }, { orderNumber: 10298 }, { orderNumber: 10345 }];
        const mockOrder = () => {
            return {
                where: () => {
                    return {
                        select: sinon.fake.returns(order),
                    };
                },
            };
        };
        sinon.replace(Order, "query", mockOrder);
        const result = await customerService.getPaymentForCustomer(103);
        expect(result).to.be.an("array");
    });
});

describe("Test updateInfoCustomer", () => {
    const customer = {
        customerNumber: 1236,
        customerName: "thành trần",
    };
    it("it will return list payment", async () => {
        const updated_on = moment().format("YYYY-MM-DDTHH:mm:ss");
        sinon.stub(Customer, "query").returns({
            update: sinon.stub().returnsThis(),
            where: sinon.stub().returns(customer),
        });
        sinon.replace(Promise, "all", sinon.fake.returns(true));
        const result = await customerService.updateInfoCustomer(customer, updated_on, 103);
        expect(result).to.be.an("object");
    });
});
