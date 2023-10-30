const { registerUserCustomer, loginUserCustomer } = require("../services/user_customer.service");
const { handleError } = require("../middlewares/handleError/error");

exports.registerForUserCustomer = handleError(async (req, res) => {
    const user = req.body || {};

    await registerUserCustomer(user);

    return res.status(201).send({
        success: true,
        message: "Registration successfully",
    });
});

exports.loginForUserCustomer = handleError(async (req, res) => {
    const credentials = req.body || {};
    if (!credentials.username || !credentials.password) {
        return res.status(400).send({ error: "Invalid credentials." });
    }

    const result = await loginUserCustomer(credentials);
    if (result.error) {
        return res.status(404).send({
            success: false,
            message: "Invalid username or password.",
        });
    }

    return res.send({
        success: true,
        message: "Login successfully",
        data: result,
    });
});
