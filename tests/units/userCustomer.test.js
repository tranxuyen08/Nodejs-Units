const { expect } = require("chai");
const sinon = require("sinon");
const userCustomerService = require("../../services/user_customer.service");
const account = require("../../utils/account");

describe("Test register function ", () => {
    it("must be success", async () => {
        const user = {
            username: "test",
            password: "12345",
            customerNumber: 1002,
        };
        const mockPassword = sinon.fake.returns({
            message: `Successfully created user ${user.username}`,
        });
        sinon.replace(account, "register", mockPassword);
        const result = await userCustomerService.registerUserCustomer(user);
        expect(result.message).to.equal(`Successfully created user ${user.username}`);
    });
});

describe("test login function", () => {
    afterEach(() => {
        sinon.restore();
    });

    it("will be successfull and return token", async () => {
        const user = {
            username: "test",
            password: "12345",
            customerNumber: 1002,
        };
        const generateTokenMock = sinon.fake.returns("this is token");
        sinon.replace(account, "login", generateTokenMock);
        const result = await userCustomerService.loginUserCustomer(user);
        expect(result).to.equal("this is token");
    });
});
