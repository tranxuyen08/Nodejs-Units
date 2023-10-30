const account = require("../utils/account");

const registerEmployee = async (user) => {
    const result = await account.register(user, "User");
    return result;
};

const loginEmployee = async (credentials) => {
    const result = await account.login(credentials, "User");
    return result;
};

module.exports = {
    registerEmployee,
    loginEmployee,
};
