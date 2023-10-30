exports.up = function (knex) {
    return knex.schema.alterTable("employees", (table) => {
        table.unique("email");
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable("employees", (table) => {
        table.dropUnique("email");
    });
};
