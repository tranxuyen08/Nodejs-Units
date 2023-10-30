exports.seed = function (knex) {
    return knex("employees").where("employeeNumber", 1143).update({
        jobTitle: "Leader",
    });
};
