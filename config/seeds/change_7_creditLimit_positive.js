exports.seed = function (knex) {
    return knex("customers").where("creditLimit", 0).update({
        creditLimit: 150,
    });
};
