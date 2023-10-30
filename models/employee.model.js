const { Model } = require("objection");
const knex = require("knex");
const knexFile = require("../knexfile");

const Office = require("./office.model");

Model.knex(knex(knexFile.development));
class Employee extends Model {
    static get tableName() {
        return "employees";
    }

    static get relationMappings() {
        const Customer = require("./customer.model");
        return {
            customers: {
                relation: Model.HasManyRelation,
                modelClass: Customer,
                join: {
                    from: "employees.employeeNumber",
                    to: "customers.salesRepEmployeeNumber",
                },
            },

            officer: {
                relation: Model.BelongsToOneRelation,
                modelClass: Office,
                join: {
                    from: "employees.officeCode",
                    to: "offices.officeCode",
                },
            },
        };
    }
}

module.exports = Employee;
