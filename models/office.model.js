const { Model } = require("objection");
const knex = require("knex");
const knexFile = require("../knexfile");
const Employee = require("./employee.model");

Model.knex(knex(knexFile.development));

class Office extends Model {
    static get tableName() {
        return "offices";
    }

    static get relationMappings() {
        return {
            employeeOfOffice: {
                relation: Model.HasManyRelation,
                modelClass: Employee,
                join: {
                    from: "offices.officeCode",
                    to: "employees.officeCode",
                },
            },
        };
    }
}

module.exports = Office;
