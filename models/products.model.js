const { Model } = require("objection");
const knex = require("knex");
const knexFile = require("../knexfile");
const ProductLine = require("./productlines.model");
const Order = require("./orders.model");

Model.knex(knex(knexFile.development));

class Product extends Model {
    static get tableName() {
        return "products";
    }

    static get idColumn() {
        return "productCode";
    }

    static get relationMappings() {
        return {
            productAndProductline: {
                relation: Model.BelongsToOneRelation,
                modelClass: ProductLine,
                join: {
                    from: "products.productLine",
                    to: "productlines.productLine",
                },
            },

            productAndOrder: {
                relation: Model.ManyToManyRelation,
                modelClass: Order,
                join: {
                    from: "products.productCode",
                    through: {
                        from: "orderdetails.productCode",
                        to: "orderdetails.orderNumber",
                    },
                    to: "orders.orderNumber",
                },
            },
        };
    }
}

module.exports = Product;
