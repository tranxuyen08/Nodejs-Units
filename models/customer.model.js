const { Model } = require("objection");
const knex = require("knex");
const knexFile = require("../knexfile");
const Employee = require("./employee.model");
const Order = require("./orders.model");

Model.knex(knex(knexFile.development));

class Customer extends Model {
    static get tableName() {
        return "customers";
    }

    static get idColumn() {
        return "customerNumber";
    }

    static get modelPaths() {
        return [__dirname];
    }

    static get relationMappings() {
        return {
            employees: {
                relation: Model.BelongsToOneRelation,
                modelClass: Employee,
                join: {
                    from: "customers.salesRepEmployeeNumber",
                    to: "employees.employeeNumber",
                },
            },

            orders: {
                relation: Model.HasManyRelation,
                modelClass: Order,
                join: {
                    from: "customers.customerNumber",
                    to: "orders.customerNumber",
                },
            },
        };
    }
}

module.exports = Customer;
