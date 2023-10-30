exports.seed = function (knex) {
    return knex("employees").where("employeeNumber", 1102).update({
        jobTitle: "Leader",
    });
};
