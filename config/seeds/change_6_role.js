exports.seed = function (knex) {
    return knex("employees").where("jobTitle", "Sales Rep").update({
        jobTitle: "Staff",
    });
};
