const { Model } = require("objection");
const knex = require("knex");
const knexFile = require("../knexfile");
const Customer = require("./customer.model");
const Product = require("./products.model");
const OrderDetail = require("./orderdetails.model");

Model.knex(knex(knexFile.development));

class Order extends Model {
    static get tableName() {
        return "orders";
    }

    static get idColumn() {
        return "orderNumber";
    }

    static get relationMappings() {
        return {
            orderAndCustomer: {
                relation: Model.BelongsToOneRelation,
                modelClass: Customer,
                join: {
                    from: "orders.customerNumber",
                    to: "customers.customerNumber",
                },
            },

            OrderAndProduct: {
                relation: Model.ManyToManyRelation,
                modelClass: Product,
                join: {
                    from: "orders.orderNumber",
                    through: {
                        from: "orderdetails.orderNumber",
                        to: "orderdetails.productCode",
                    },
                    to: "products.productCode",
                },
            },

            orderdetails: {
                relation: Model.HasManyRelation,
                modelClass: OrderDetail,
                join: {
                    from: "orders.orderNumber",
                    to: "orderdetails.orderNumber",
                },
            },
        };
    }
}

module.exports = Order;
