const { registerEmployee, loginEmployee } = require("../services/user.service");
const { handleError } = require("../middlewares/handleError/error");

exports.registerForEmployee = handleError(async (req, res) => {
    const user = req.body || {};

    await registerEmployee(user);

    return res.status(201).send({
        success: true,
        message: "Registration successfully",
    });
});

exports.loginForEmployee = handleError(async (req, res) => {
    const credentials = req.body || {};

    if (!credentials.username || !credentials.password) {
        return res.status(400).send({ error: "Invalid credentials." });
    }

    const result = await loginEmployee(credentials);

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
