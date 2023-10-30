const { expect } = require("chai");
const moment = require("moment");
const sinon = require("sinon");
const LogModel = require("../../models/mongoModel/logger.model");
const logService = require("../../services/logger.service");

describe("Test loggerToDb function", () => {
    afterEach(() => {
        sinon.restore();
    });
    it("It should return object", async () => {
        const headerInfo = {
            userInfo: {
                employeeNumber: 1223,
                officeCode: "5",
                jobTitle: "Staff",
            },
            action: "https://gitlab.com/maixuanhoa1995/mock-project/-/merge_requests/26",
            method: "GET",
        };
        const error = {
            message: "Cannot update",
            status: "Failed",
            stack: "Ok failed",
        };
        const log = {
            title: "error.message",
            time: "2021-11-12",
            action: "https://gitlab.com/maixuanhoa1995/mock-project",
            status: "Failed",
            createdBy: {
                employeeNumber: 1245,
                officeCode: "5",
                jobTitle: "Staff",
            },
            message: "error.stack",
        };

        const logModelMock = sinon.fake.returns(log);
        sinon.replace(LogModel, "create", logModelMock);
        const result = await logService.loggerToDb(error, headerInfo);
        expect(result).to.be.an("object");
    });
});

describe("Test getLogger function", () => {
    afterEach(() => {
        sinon.restore();
    });
    it("It should return object with only employee", async () => {
        const log = {
            title: "error.message",
            time: "2021-11-12",
            action: "https://gitlab.com/maixuanhoa1995/mock-project",
            status: "Failed",
            createdBy: {
                employeeNumber: 1245,
                officeCode: "5",
                jobTitle: "Staff",
            },
            message: "error.stack",
        };
        const filters = {
            start_date: "2005-01-02",
            end_date: moment().format("YYYY-MM-DDTHH:mm:ss"),
            employeeNumber: 1000,
        };
        sinon.stub(LogModel, "find").returns({
            skip: sinon.stub().returnsThis(),
            limit: sinon.fake.returns(log),
        });
        const result = await logService.getLogger(filters);
        expect(result).to.be.an("object");
    });
    it("It should return object  with only officeCode", async () => {
        const log = {
            title: "error.message",
            time: "2021-11-12",
            action: "https://gitlab.com/maixuanhoa1995/mock-project",
            status: "Failed",
            createdBy: {
                employeeNumber: 1245,
                officeCode: "5",
                jobTitle: "Staff",
            },
            message: "error.stack",
        };
        const filters = {
            start_date: "2005-01-02",
            end_date: moment().format("YYYY-MM-DDTHH:mm:ss"),
            officeCode: "5",
        };
        sinon.stub(LogModel, "find").returns({
            skip: sinon.stub().returnsThis(),
            limit: sinon.fake.returns(log),
        });
        const result = await logService.getLogger(filters);
        expect(result).to.be.an("object");
    });
    it("It should return object  with only jobTitle", async () => {
        const log = {
            title: "error.message",
            time: "2021-11-12",
            action: "https://gitlab.com/maixuanhoa1995/mock-project",
            status: "Failed",
            createdBy: {
                employeeNumber: 1245,
                officeCode: "5",
                jobTitle: "Staff",
            },
            message: "error.stack",
        };
        const filters = {
            start_date: "2005-01-02",
            end_date: moment().format("YYYY-MM-DDTHH:mm:ss"),
            jobTitle: "Staff",
        };
        sinon.stub(LogModel, "find").returns({
            skip: sinon.stub().returnsThis(),
            limit: sinon.fake.returns(log),
        });
        const result = await logService.getLogger(filters);
        expect(result).to.be.an("object");
    });
    it("It should return object", async () => {
        const log = {
            title: "error.message",
            time: "2021-11-12",
            action: "https://gitlab.com/maixuanhoa1995/mock-project",
            status: "Failed",
            createdBy: {
                employeeNumber: 1245,
                officeCode: "5",
                jobTitle: "Staff",
            },
            message: "error.stack",
        };
        const filters = {
            start_date: "2005-01-02",
        };
        sinon.stub(LogModel, "find").returns({
            skip: sinon.stub().returnsThis(),
            limit: sinon.fake.returns(log),
        });
        const result = await logService.getLogger(filters);
        expect(result).to.be.an("object");
    });
    it("It return error: Please provide start_date to get logger! ", async () => {
        const log = {
            title: "error.message",
            time: "2021-11-12",
            action: "https://gitlab.com/maixuanhoa1995/mock-project",
            status: "Failed",
            createdBy: {
                employeeNumber: 1245,
                officeCode: "5",
                jobTitle: "Staff",
            },
            message: "error.stack",
        };
        const filters = {};
        try {
            const logModelMock = sinon.fake.returns(log);
            sinon.replace(LogModel, "find", logModelMock);
            const result = await logService.getLogger(filters);
            return result;
        } catch (error) {
            expect(error.message).to.equal("Please provide start_date to get logger!");
        }
    });
});
