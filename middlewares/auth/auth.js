const jwt = require("jsonwebtoken");

const auth = (roles) => {
    return (req, res, next) => {
        const authorization = req.headers.authorization || "";
        const secret = process.env.TOKEN_SECRET;
        try {
            const token = authorization.replace("Bearer ", "");

            if (!token) {
                throw new Error();
            }

            const data = jwt.verify(token, secret);
            const role = data.jobTitle;
            if (!roles.includes(role)) {
                throw new Error();
            }
            res.locals.authData = data;
            return next();
        } catch (error) {
            return res.status(401).send({ status: "error", message: "Unauthorize!" });
        }
    };
};

module.exports = auth;
