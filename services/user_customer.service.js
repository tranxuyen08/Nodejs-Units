const account = require("../utils/account");

const registerUserCustomer = async (user) => {
    const result = await account.register(user, "UserCustomer");
    return result;
};

const loginUserCustomer = async (credentials) => {
    const result = await account.login(credentials, "UserCustomer");
    return result;
};

module.exports = {
    registerUserCustomer,
    loginUserCustomer,
};
