exports.seed = function (knex) {
    return knex("employees").where("employeeNumber", 1076).update({
        jobTitle: "Manager",
    });
};
