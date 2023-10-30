exports.seed = function (knex) {
    return knex("employees").where("employeeNumber", 1088).update({
        jobTitle: "Leader",
    });
};
