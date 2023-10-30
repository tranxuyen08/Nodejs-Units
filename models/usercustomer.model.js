const { Model } = require("objection");
const knex = require("knex");
const knexFile = require("../knexfile");
const Customer = require("./customer.model");

Model.knex(knex(knexFile.development));

class UserCustomer extends Model {
    static get tableName() {
        return "usercustomers";
    }

    static get relationMappings() {
        return {
            customers: {
                relation: Model.BelongsToOneRelation,
                modelClass: Customer,
                join: {
                    from: "usercustomers.customerNumber",
                    to: "customers.customerNumber",
                },
            },
        };
    }
}

module.exports = UserCustomer;
