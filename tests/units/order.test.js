const { expect } = require("chai");
const sinon = require("sinon");
const Order = require("../../models/orders.model");
const common = require("../../utils/common");
const orderService = require("../../services/order.service");

describe("Test getAllOrder function ", () => {
    afterEach(() => {
        sinon.restore();
    });
    it("it will return list Order", async () => {
        const filters = {
            orderNumber: 12345,
        };
        const mockTime = [
            {
                minOrder: "2021-12-04T09:54:14.000Z",
            },
        ];
        const mock = () => {
            return {
                min: sinon.fake.returns(mockTime),
            };
        };
        sinon.replace(Order, "query", mock);
        sinon.replace(common, "getAllAnyResource", sinon.fake.returns([]));
        const result = await orderService.getAllOrder(filters);
        expect(result).to.be.a("array");
    });
});

describe("Test getOrderByOrderNumber", () => {
    afterEach(() => {
        sinon.restore();
    });
    it("it will return a order", async () => {
        sinon.replace(common, "checkValidOrderNumber", sinon.fake.returns(true));
        const fnMock = () => {
            return {
                findOne: sinon.fake.returns({ orderNumber: "12M456" }),
            };
        };
        sinon.replace(Order, "query", fnMock);
        const result = await orderService.getOrderByOrderNumber("12M456");
        expect(result).to.be.an("object");
    });
});

describe("Test getOrderCustomerSelf", () => {
    afterEach(() => {
        sinon.restore();
    });
    it("it will return a list order belong to customer", async () => {
        const fnMock = () => {
            return {
                where: () => {
                    return {
                        select: () => {
                            return {
                                withGraphFetched: () => {
                                    return {
                                        modifiers: sinon.fake.returns([
                                            { orderNumber: "12M456" },
                                            { orderNumber: "12M456" },
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
        const result = await orderService.getOrderCustomerSelf(103);
        expect(result).to.be.a("array");
    });

    it("it will throw error: You don't have any order! Order now!", async () => {
        try {
            sinon.stub(Order, "query").returns({
                where: sinon.stub().returnsThis(),
                select: sinon.stub().returnsThis(),
                withGraphFetched: sinon.stub().returnsThis(),
                modifiers: sinon.fake.returns(null),
            });
            await orderService.getOrderCustomerSelf(103);
        } catch (error) {
            expect(error.message).to.equal("You don't have any order! Order now!");
        }
    });
});

describe("Test updateOrderByOrderNumber", () => {
    afterEach(() => {
        sinon.restore();
    });
    it("it will return a list order belong to customer if it is in process", async () => {
        sinon.replace(
            common,
            "checkValidOrderNumber",
            sinon.fake.returns({ status: "In Process" }),
        );
        const fnMock = () => {
            return {
                update: () => {
                    return {
                        findOne: sinon.fake.returns({ orderNumber: "12M456" }),
                    };
                },
            };
        };
        sinon.replace(Order, "query", fnMock);
        const result = await orderService.updateOrderByOrderNumber(1236, { status: "Disputed" });
        const result1 = await orderService.updateOrderByOrderNumber(1236, { status: "On Hold" });
        const result3 = await orderService.updateOrderByOrderNumber(1236, { status: "Shipped" });
        const result4 = await orderService.updateOrderByOrderNumber(1236, { status: "Cancelled" });
        expect(result).to.be.an("object");
        expect(result1).to.be.an("object");
        expect(result3).to.be.an("object");
        expect(result4).to.be.an("object");
    });
    it("it will return a list order belong to customer if it is not in process", async () => {
        sinon.replace(common, "checkValidOrderNumber", sinon.fake.returns({ status: "Disputed" }));
        const fnMock = () => {
            return {
                update: () => {
                    return {
                        findOne: sinon.fake.returns({ orderNumber: "12M456" }),
                    };
                },
            };
        };
        sinon.replace(Order, "query", fnMock);
        const result = await orderService.updateOrderByOrderNumber(1236, { status: "Resolved" });
        expect(result).to.be.an("object");
    });

    it("it should throw error: ", async () => {
        try {
            sinon.replace(
                common,
                "checkValidOrderNumber",
                sinon.fake.returns({ status: "In Process" }),
            );
            const fnMock = () => {
                return {
                    update: () => {
                        return {
                            findOne: sinon.fake.returns({ orderNumber: "12M456" }),
                        };
                    },
                };
            };
            sinon.replace(Order, "query", fnMock);
            await orderService.updateOrderByOrderNumber(1236, {
                status: "Holdon",
            });
        } catch (error) {
            expect(error.message).to.equal("Please follow the procedure!");
        }
    });

    it("it will return a list order belong to customer if it is not in process", async () => {
        sinon.replace(common, "checkValidOrderNumber", sinon.fake.returns({ status: "Resolved" }));
        const fnMock = () => {
            return {
                update: () => {
                    return {
                        findOne: sinon.fake.returns({ orderNumber: "12M456" }),
                    };
                },
            };
        };
        sinon.replace(Order, "query", fnMock);
        const result = await orderService.updateOrderByOrderNumber(1236, { status: "Cancelled" });
        expect(result).to.be.an("object");
    });
    it("it will return a list order belong to customer if it is not in process", async () => {
        sinon.replace(common, "checkValidOrderNumber", sinon.fake.returns({ status: "On Hold" }));
        const fnMock = () => {
            return {
                update: () => {
                    return {
                        findOne: sinon.fake.returns({ orderNumber: "12M456" }),
                    };
                },
            };
        };
        sinon.replace(Order, "query", fnMock);
        const result = await orderService.updateOrderByOrderNumber(1236, { status: "Cancelled" });
        const result1 = await orderService.updateOrderByOrderNumber(1236, { status: "Shipped" });
        const result2 = await orderService.updateOrderByOrderNumber(1236, { status: "In Process" });
        expect(result).to.be.an("object");
        expect(result1).to.be.an("object");
        expect(result2).to.be.an("object");
    });
    it("it throw Please follow the procedure!", async () => {
        try {
            sinon.replace(common, "checkValidOrderNumber", sinon.fake.returns({ status: "COD" }));
            const result = await orderService.updateOrderByOrderNumber(1236, {
                status: "Cancelled",
            });
            return result;
        } catch (error) {
            expect(error.message).to.equal("Please follow the procedure!");
        }
    });
    it("it throw Please follow the procedure! if not in InProcess ", async () => {
        try {
            sinon.replace(common, "checkValidOrderNumber", sinon.fake.returns({ status: "COD" }));
            await orderService.updateOrderByOrderNumber(1236, {
                status: "Cancelled",
            });
        } catch (error) {
            expect(error.message).to.equal("Please follow the procedure!");
        }
    });
    it("it throw Please follow the procedure! if not in InProcess ", async () => {
        try {
            sinon.replace(
                common,
                "checkValidOrderNumber",
                sinon.fake.returns({ status: "Shipped" }),
            );
            await orderService.updateOrderByOrderNumber(1236, {
                status: "Resolved",
            });
        } catch (error) {
            expect(error.message).to.equal("Please follow the procedure!");
        }
    });
    it("it throw Please follow the procedure! if not in InProcess ", async () => {
        try {
            sinon.replace(
                common,
                "checkValidOrderNumber",
                sinon.fake.returns({ status: "Shipped" }),
            );
            await orderService.updateOrderByOrderNumber(1236, {
                status: "On Hold",
            });
        } catch (error) {
            expect(error.message).to.equal("Please follow the procedure!");
        }
    });
    it("it throw Please follow the procedure! if not in InProcess ", async () => {
        try {
            sinon.replace(
                common,
                "checkValidOrderNumber",
                sinon.fake.returns({ status: "Shipped" }),
            );
            await orderService.updateOrderByOrderNumber(1236, {
                status: "In Process",
            });
        } catch (error) {
            expect(error.message).to.equal("Please follow the procedure!");
        }
    });
    it("it throw Please follow the procedure! if not in InProcess ", async () => {
        try {
            sinon.replace(
                common,
                "checkValidOrderNumber",
                sinon.fake.returns({ status: "Cancelled" }),
            );
            await orderService.updateOrderByOrderNumber(1236, {
                status: "In Process",
            });
        } catch (error) {
            expect(error.message).to.equal("Please follow the procedure!");
        }
    });
    it("it throw Please follow the procedure! if not in InProcess ", async () => {
        try {
            sinon.replace(
                common,
                "checkValidOrderNumber",
                sinon.fake.returns({ status: "Cancelled" }),
            );
            await orderService.updateOrderByOrderNumber(1236, {
                status: "Resolved",
            });
        } catch (error) {
            expect(error.message).to.equal("Please follow the procedure!");
        }
    });
    it("it throw Please follow the procedure! if not in InProcess ", async () => {
        try {
            sinon.replace(
                common,
                "checkValidOrderNumber",
                sinon.fake.returns({ status: "Cancelled" }),
            );
            await orderService.updateOrderByOrderNumber(1236, {
                status: "On Hold",
            });
        } catch (error) {
            expect(error.message).to.equal("Please follow the procedure!");
        }
    });
    it("it throw Please follow the procedure! if not in InProcess ", async () => {
        try {
            sinon.replace(
                common,
                "checkValidOrderNumber",
                sinon.fake.returns({ status: "Resolved" }),
            );
            await orderService.updateOrderByOrderNumber(1236, {
                status: "Disputed",
            });
        } catch (error) {
            expect(error.message).to.equal("Please follow the procedure!");
        }
    });
    it("it throw Please follow the procedure! if not in InProcess ", async () => {
        try {
            sinon.replace(
                common,
                "checkValidOrderNumber",
                sinon.fake.returns({ status: "Disputed" }),
            );
            await orderService.updateOrderByOrderNumber(1236, {
                status: "In Process",
            });
        } catch (error) {
            expect(error.message).to.equal("Please follow the procedure!");
        }
    });
});

describe("Test createOrder", () => {
    afterEach(() => {
        sinon.restore();
    });
    before(() => {
        sinon.restore();
    });
    it("it will create successfully", async () => {
        sinon.replace(common, "checkValidCustomerNumber", sinon.fake.returns({ creditLimit: 5 }));
        sinon.replace(common, "random8Character", sinon.fake.returns("abcdefgh"));
        sinon.replace(common, "totalBill", sinon.fake.returns(12300));

        const fnOrderMock = () => {
            return {
                max: sinon.fake.returns([123]),
            };
        };
        const order = {
            status: "COD",
            orderDate: "2003-05-27",
            requiredDate: "2003-05-27",
            shippedDate: "2003-05-20",
            comments: null,
            customerNumber: 103,
            orderdetails: [
                {
                    productCode: "S18_1749",
                    quantityOrdered: 1000,
                    orderLineNumber: 1,
                },
                {
                    productCode: "S18_2248",
                    quantityOrdered: 160,
                    orderLineNumber: 2,
                },
            ],
        };
        sinon.replace(common, "getTotalAmountProcess", sinon.fake.returns(1122));
        sinon.replace(common, "checkValidProductCode", sinon.fake.returns({ buyPrice: 1234 }));
        sinon.replace(Order, "query", fnOrderMock);
        sinon.replace(
            Order,
            "transaction",
            sinon.fake.returns({ orderNumber: "NH123365", status: "In Process" }),
        );
        const result = await orderService.createOrder(order, 133);
        expect(result).to.be.an("object");
    });

    it("it will create successfully", async () => {
        sinon.replace(common, "checkValidCustomerNumber", sinon.fake.returns({ creditLimit: 5 }));
        sinon.replace(common, "random8Character", sinon.fake.returns("abcdefgh"));
        sinon.replace(common, "totalBill", sinon.fake.returns(12300));
        const order = {
            status: "COD",
            orderDate: "2003-05-27",
            requiredDate: "2003-05-27",
            shippedDate: "2003-05-20",
            comments: null,
            customerNumber: 103,
            orderdetails: [
                {
                    productCode: "S18_1749",
                    quantityOrdered: 1000,
                    orderLineNumber: 1,
                },
                {
                    productCode: "S18_2248",
                    quantityOrdered: 160,
                    orderLineNumber: 2,
                },
            ],
        };
        const fnOrderMock = () => {
            return {
                max: sinon.fake.returns([123]),
                insertGraphAndFetch: sinon.fake.returns(true),
            };
        };
        sinon.replace(Order, "query", fnOrderMock);
        sinon.replace(
            Order,
            "transaction",
            sinon.fake.returns({ orderNumber: "NH123365", status: "In Process" }),
        );
        const result = await orderService.createOrder(order, 133);
        expect(result).to.be.an("object");
    });
});

describe("Test deleteOrder", () => {
    afterEach(() => {
        sinon.restore();
    });
    it("it delete successfully", async () => {
        sinon.replace(common, "checkValidOrderNumber", sinon.fake.returns(true));
        sinon.replace(Order, "transaction", sinon.fake.returns(true));
        const result = await orderService.deleteOrder("Nhm123");
        expect(result).to.be.true;
    });
});
