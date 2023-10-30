exports.seed = function (knex) {
    return knex("employees").where("employeeNumber", 1056).update({
        jobTitle: "Manager",
    });
};
