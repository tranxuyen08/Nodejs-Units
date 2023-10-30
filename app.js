require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const { errors } = require("celebrate");
const YAML = require("yamljs");
const swaggerUIExpress = require("swagger-ui-express");
// const mysql = require("mysql");
const mongoDb = require("./models/mongoModel/index.model");
const { handleErrorsGlobal } = require("./middlewares/handleError/error");
const customerRouter = require("./routes/customer.route");
const employeeRouter = require("./routes/employee.route");
const reportRouter = require("./routes/report.route");
const userRouter = require("./routes/user.route");
const userCustomerRouter = require("./routes/user_customer.route");
const officeRouter = require("./routes/office.route");
const productRouter = require("./routes/product.route");
const productLineRouter = require("./routes/productLine.route");
const orderRouter = require("./routes/order.route");
const loggerRouter = require("./routes/logger.route");

const PORT = process.env.PORT || 3000;
const swaggerYAML = YAML.load("./swagger.yaml");

const app = express();
app.use(morgan("dev"));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Connect to mongoose
mongoDb.mongoose
    .connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("MongoDB database connected...");
    })
    .catch((error) => {
        console.log("Can not connect to database: ", error.message);
    });

app.get("/", (req, res) => {
    res.json({ message: "Welcome to Hacker web" });
});

// Route for app
app.use("/api/customers", customerRouter);
app.use("/api/employees", employeeRouter);
app.use("/api/reports", reportRouter);
app.use("/api/users/employees", userRouter);
app.use("/api/users/customers", userCustomerRouter);
app.use("/api/offices", officeRouter);
app.use("/api/products", productRouter);
app.use("/api/product-lines", productLineRouter);
app.use("/api/orders", orderRouter);
app.use("/api/loggers", loggerRouter);
app.use("/docs", swaggerUIExpress.serve, swaggerUIExpress.setup(swaggerYAML));

app.all("*", (req, res) => {
    return res.status(404).send({
        message: `${req.originalUrl} not found.`,
    });
});

app.use(handleErrorsGlobal);

// Handle err when validation request
app.use(errors());
// Listen app on port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
