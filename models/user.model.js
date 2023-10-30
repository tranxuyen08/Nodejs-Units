const { Model } = require("objection");
const knex = require("knex");
const knexFile = require("../knexfile");
const Employee = require("./employee.model");

Model.knex(knex(knexFile.development));

class User extends Model {
    static get tableName() {
        return "users";
    }

    static get relationMappings() {
        return {
            employees: {
                relation: Model.BelongsToOneRelation,
                modelClass: Employee,
                join: {
                    from: "users.employeeNumber",
                    to: "employees.employeeNumber",
                },
            },
        };
    }
}

module.exports = User;
