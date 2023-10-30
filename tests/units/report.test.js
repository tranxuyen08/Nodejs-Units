const moment = require("moment");
const { expect } = require("chai");
const sinon = require("sinon");
const common = require("../../utils/common");
const Office = require("../../models/office.model");
const Employee = require("../../models/employee.model");
const Order = require("../../models/orders.model");
const reportService = require("../../services/report.service");

describe("Test getRevenueByOfficeInRangeTime function", () => {
    it("It should return array", async () => {
        before(() => {
            sinon.restore();
        });
        afterEach(() => {
            sinon.restore();
        });
        const start_date = "2005-12-06";
        const end_date = "2009-12-07";
        const report = [
            {
                revenue: 1537841.49,
                officeCode: "1",
            },
            {
                revenue: 882314.79,
                officeCode: "2",
            },
        ];
        sinon.stub(Office, "query").returns({
            select: sinon.stub().returnsThis(),
            from: sinon.stub().returnsThis(),
            join: sinon.stub().returnsThis(),
            whereBetween: sinon.stub().returnsThis(),
            groupBy: sinon.stub().returnsThis(),
            orderBy: sinon.stub().returns(report),
        });
        const result = await reportService.getRevenueByOfficeInRangeTime(start_date, end_date);
        expect(result).to.be.an("array");
    });

    it("It should throw error: when start_date > end_date", async () => {
        try {
            const start_date = "2005-12-06";
            const end_date = "2005-12-06";
            const report = [
                {
                    revenue: 1537841.49,
                    officeCode: "1",
                },
                {
                    revenue: 882314.79,
                    officeCode: "2",
                },
            ];
            sinon.stub(Office, "query").returns({
                select: sinon.stub().returnsThis(),
                from: sinon.stub().returnsThis(),
                join: sinon.stub().returnsThis(),
                whereBetween: sinon.stub().returnsThis(),
                groupBy: sinon.stub().returnsThis(),
                orderBy: sinon.stub().returns(report),
            });
            await reportService.getRevenueByOfficeInRangeTime(start_date, end_date);
        } catch (error) {
            expect(error.message).to.equal("start_date must be less than end_date");
        }
    });

    it("It should return array without start_date", async () => {
        const end_date = "2005-12-06";
        let start_date;
        const report = [
            {
                revenue: 1537841.49,
                officeCode: "1",
            },
            {
                revenue: 882314.79,
                officeCode: "2",
            },
        ];
        const arr = [
            {
                minOrder: "2003-12-06",
            },
        ];
        const mockOrder = () => {
            return {
                min: sinon.fake.returns(arr),
            };
        };
        sinon.replace(Order, "query", mockOrder);
        sinon.stub(Office, "query").returns({
            select: sinon.stub().returnsThis(),
            from: sinon.stub().returnsThis(),
            join: sinon.stub().returnsThis(),
            whereBetween: sinon.stub().returnsThis(),
            groupBy: sinon.stub().returnsThis(),
            orderBy: sinon.stub().returns(report),
        });
        const result = await reportService.getRevenueByOfficeInRangeTime(start_date, end_date);
        expect(result).to.be.an("array");
    });
});

describe("Test getRevenueByProductLineInRangeTimeByOffice function", () => {
    before(() => {
        sinon.restore();
    });
    afterEach(() => {
        sinon.restore();
    });
    it("It should return array", async () => {
        afterEach(() => {
            sinon.restore();
        });
        const start_date = "2005-12-06";
        const officeCode = "1";
        const report = [
            {
                revenue: 1537841.49,
                officeCode: "1",
            },
            {
                revenue: 882314.79,
                officeCode: "2",
            },
        ];
        const fakeCheck = sinon.fake.returns(true);
        sinon.replace(common, "checkValidOfficeCode", fakeCheck);
        sinon.stub(Office, "query").returns({
            select: sinon.stub().returnsThis(),
            from: sinon.stub().returnsThis(),
            join: sinon.stub().returnsThis(),
            where: sinon.stub().returnsThis(),
            whereBetween: sinon.stub().returnsThis(),
            groupBy: sinon.stub().returnsThis(),
            orderBy: sinon.stub().returns(report),
        });
        const result = await reportService.getRevenueByProductLineInRangeTimeByOffice(
            start_date,
            moment().format("YYYY-MM-DD"),
            officeCode,
        );
        expect(result).to.be.an("object");
    });

    it("It should throw error: when start_date > end_date", async () => {
        try {
            const start_date = "2005-12-06";
            const end_date = "2005-12-06";
            const officeCode = "1";
            const report = [
                {
                    revenue: 1537841.49,
                    officeCode: "1",
                },
                {
                    revenue: 882314.79,
                    officeCode: "2",
                },
            ];
            const fakeCheck = sinon.fake.returns(true);
            sinon.replace(common, "checkValidOfficeCode", fakeCheck);
            sinon.stub(Office, "query").returns({
                select: sinon.stub().returnsThis(),
                from: sinon.stub().returnsThis(),
                join: sinon.stub().returnsThis(),
                where: sinon.stub().returnsThis(),
                whereBetween: sinon.stub().returnsThis(),
                groupBy: sinon.stub().returnsThis(),
                orderBy: sinon.stub().returns(report),
            });
            await reportService.getRevenueByProductLineInRangeTimeByOffice(
                start_date,
                end_date,
                officeCode,
            );
        } catch (error) {
            expect(error.message).to.equal("start_date must be less than end_date");
        }
    });

    it("It should return array without start_date", async () => {
        const end_date = "2005-12-06";
        let start_date;
        const officeCode = "1";
        const report = [
            {
                revenue: 1537841.49,
                officeCode: "1",
            },
            {
                revenue: 882314.79,
                officeCode: "2",
            },
        ];
        const arr = [
            {
                minOrder: "2003-12-06",
            },
        ];
        const mockOrder = () => {
            return {
                min: sinon.fake.returns(arr),
            };
        };
        const fakeCheck = sinon.fake.returns(true);
        sinon.replace(common, "checkValidOfficeCode", fakeCheck);
        sinon.replace(Order, "query", mockOrder);
        sinon.stub(Office, "query").returns({
            select: sinon.stub().returnsThis(),
            from: sinon.stub().returnsThis(),
            join: sinon.stub().returnsThis(),
            where: sinon.stub().returnsThis(),
            whereBetween: sinon.stub().returnsThis(),
            groupBy: sinon.stub().returnsThis(),
            orderBy: sinon.stub().returns(report),
        });
        const result = await reportService.getRevenueByProductLineInRangeTimeByOffice(
            start_date,
            end_date,
            officeCode,
        );
        expect(result).to.be.an("object");
    });
});

describe("Test getRevenueOfCustomers function", () => {
    before(() => {
        sinon.restore();
    });
    afterEach(() => {
        sinon.restore();
    });
    it("It should return array", async () => {
        afterEach(() => {
            sinon.restore();
        });
        const start_date = "2005-12-06";
        const end_date = "2009-12-07";
        const report = [
            {
                employeeNumber: 1205,
                revenue: 455468.3,
                "count(distinct customers.customerNumber)": 6,
            },
            {
                employeeNumber: 1785,
                revenue: 152684.5,
                "count(distinct customers.customerNumber)": 6,
            },
        ];
        sinon.stub(Employee, "query").returns({
            select: sinon.stub().returnsThis(),
            countDistinct: sinon.stub().returnsThis(),
            from: sinon.stub().returnsThis(),
            join: sinon.stub().returnsThis(),
            whereBetween: sinon.stub().returnsThis(),
            groupBy: sinon.stub().returnsThis(),
            orderBy: sinon.stub().returns(report),
        });
        const result = await reportService.getRevenueOfCustomers(start_date, end_date);
        expect(result).to.be.an("array");
    });

    it("It should throw error: when start_date > end_date", async () => {
        try {
            const start_date = "2005-12-06";
            const end_date = "2005-12-06";
            await reportService.getRevenueOfCustomers(start_date, end_date);
        } catch (error) {
            expect(error.message).to.equal("start_date must be less than end_date");
        }
    });

    it("It should return array without start_date", async () => {
        const end_date = "2005-12-06";
        let start_date;
        const report = [
            {
                revenue: 1537841.49,
                officeCode: "1",
            },
            {
                revenue: 882314.79,
                officeCode: "2",
            },
        ];
        const arr = [
            {
                minOrder: "2003-12-06",
            },
        ];
        const mockOrder = () => {
            return {
                min: sinon.fake.returns(arr),
            };
        };
        sinon.replace(Order, "query", mockOrder);
        sinon.stub(Employee, "query").returns({
            select: sinon.stub().returnsThis(),
            countDistinct: sinon.stub().returnsThis(),
            from: sinon.stub().returnsThis(),
            join: sinon.stub().returnsThis(),
            whereBetween: sinon.stub().returnsThis(),
            groupBy: sinon.stub().returnsThis(),
            orderBy: sinon.stub().returns(report),
        });
        const result = await reportService.getRevenueOfCustomers(start_date, end_date);
        expect(result).to.be.an("array");
    });
});
