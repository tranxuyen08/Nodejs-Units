const { Model } = require("objection");
const knex = require("knex");
const knexFile = require("../knexfile");
const Product = require("./products.model");

Model.knex(knex(knexFile.development));

class ProductLine extends Model {
    static get tableName() {
        return "productlines";
    }

    static get idColumn() {
        return "productLine";
    }

    static get relationMappings() {
        return {
            productlineAndProduct: {
                relation: Model.HasManyRelation,
                modelClass: Product,
                join: {
                    from: "productlines.productLine",
                    to: "products.productLine",
                },
            },
        };
    }
}

module.exports = ProductLine;
