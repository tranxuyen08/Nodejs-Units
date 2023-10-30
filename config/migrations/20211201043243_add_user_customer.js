exports.up = function (knex) {
    return knex.schema.createTable("usercustomers", (table) => {
        table.string("username").primary().notNullable();
        table.string("password");
        table.integer("customerNumber").notNullable();
        table
            .foreign("customerNumber")
            .references("customerNumber")
            .inTable("customers");
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("usercustomers");
};
