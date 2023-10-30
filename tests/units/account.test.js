const { expect } = require("chai");
const sinon = require("sinon");
const User = require("../../models/user.model");
const UserCustomer = require("../../models/usercustomer.model");
const common = require("../../utils/common");
const account = require("../../utils/account");

describe("Test Login", () => {
    afterEach(() => {
        sinon.restore();
    });
    const credentials = {
        usernam: "ttt",
        password: "ddd",
    };
    it("user will login successfully", async () => {
        sinon.replace(common, "getUserByUsername", sinon.fake.returns(true));
        sinon.replace(common, "isPasswordValid", sinon.fake.returns(true));
        sinon.replace(common, "generateTokenUser", sinon.fake.returns("this is token"));
        const result = await account.login(credentials, "User");
        expect(result.token).to.equal("this is token");
    });
    it("userCusotmer will login successfully", async () => {
        sinon.replace(common, "getUserByUsername", sinon.fake.returns(true));
        sinon.replace(common, "isPasswordValid", sinon.fake.returns(true));
        sinon.replace(common, "generateTokenUserCustomer", sinon.fake.returns("this is token"));
        const result = await account.login(credentials, "UserCustomer");
        expect(result.token).to.equal("this is token");
    });
    it("throw error : Invalid username or password.", async () => {
        try {
            sinon.replace(common, "getUserByUsername", sinon.fake.returns(null));
            const token = await account.login(credentials, "User");
            return token;
        } catch (error) {
            expect(error.message).to.equal("Invalid username or password.");
        }
    });
    it("throw error : Invalid username or password.", async () => {
        try {
            sinon.replace(common, "isPasswordValid", sinon.fake.returns(null));
            sinon.replace(common, "getUserByUsername", sinon.fake.returns(true));
            const token = await account.login(credentials, "UserCustomer");
            return token;
        } catch (error) {
            expect(error.message).to.equal("Invalid username or password.");
        }
    });
});

describe("Test register", () => {
    afterEach(() => {
        sinon.restore();
    });
    const data = {
        username: "ttt",
        password: "ddd",
    };
    it("user will register successfully", async () => {
        sinon.replace(common, "hashPassword", sinon.fake.returns(true));
        sinon.replace(common, "checkDuplicateUserName", sinon.fake.returns(true));
        sinon.replace(common, "checkDuplicateUniqueField", sinon.fake.returns(true));
        sinon.replace(common, "checkValidEmployeeNumber", sinon.fake.returns(true));
        const fnMock = () => {
            return {
                insert: sinon.fake.returns(true),
            };
        };
        sinon.replace(User, "query", fnMock);
        const result = await account.register(data, "User");
        expect(result.message).to.equal(`Successfully created user ${data.username}`);
    });
    it("userCusotmer will register successfully", async () => {
        sinon.replace(common, "hashPassword", sinon.fake.returns(true));
        sinon.replace(common, "checkDuplicateUniqueField", sinon.fake.returns(true));
        sinon.replace(common, "checkValidCustomerNumber", sinon.fake.returns(true));
        sinon.replace(common, "checkDuplicateUserName", sinon.fake.returns(true));
        const fnMock = () => {
            return {
                insert: sinon.fake.returns(true),
            };
        };
        sinon.replace(UserCustomer, "query", fnMock);
        const result = await account.register(data, "UserCustomer");
        expect(result.message).to.equal(`Successfully created user ${data.username}`);
    });
});
