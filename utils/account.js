const User = require("../models/user.model");
const UserCustomer = require("../models/usercustomer.model");
const { AppError } = require("../middlewares/handleError/error");
const common = require("./common");

const login = async (credentials, Model) => {
    let token;
    const { username, password } = credentials;
    const user = await common.getUserByUsername(Model, username);
    if (!user) {
        throw new AppError("Invalid username or password.");
    }
    const isValidPassword = await common.isPasswordValid(password, user.password);

    if (!isValidPassword) {
        throw new AppError("Invalid username or password.");
    }
    if (Model === "User") {
        token = await common.generateTokenUser(user);
    } else if (Model === "UserCustomer") {
        token = await common.generateTokenUserCustomer(user);
    }

    return { success: true, token };
};

const register = async (data, Model) => {
    const { username, password } = data;
    const hashedPassword = await common.hashPassword(password);
    await common.checkDuplicateUserName(username, Model);
    if (Model === "User") {
        await common.checkDuplicateUniqueField(data.employeeNumber, Model);
        await common.checkValidEmployeeNumber(data.employeeNumber);
        await User.query().insert({
            ...data,
            password: hashedPassword,
        });
    } else if (Model === "UserCustomer") {
        await common.checkDuplicateUniqueField(data.customerNumber, Model);
        await common.checkValidCustomerNumber(data.customerNumber);
        await UserCustomer.query().insert({
            ...data,
            password: hashedPassword,
        });
    }
    return { message: `Successfully created user ${username}` };
};
module.exports = {
    login,
    register,
};
