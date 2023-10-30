const { Model } = require("objection");
const knex = require("knex");
const knexFile = require("../knexfile");
const Product = require("./products.model");
const Order = require("./orders.model");

Model.knex(knex(knexFile.development));

class OrderDetail extends Model {
    static get tableName() {
        return "orderdetails";
    }

    static get relationMappings() {
        return {
            products: {
                relation: Model.BelongsToOneRelation,
                modelClass: Product,
                join: {
                    from: "orderdetails.productCode",
                    to: "products.productCode",
                },
            },

            orders: {
                relation: Model.BelongsToOneRelation,
                modelClass: Order,
                join: {
                    from: "orderdetails.orderNumber",
                    to: "orders.orderNumber",
                },
            },
        };
    }
}

module.exports = OrderDetail;
