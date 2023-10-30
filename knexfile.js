require("dotenv").config();

module.exports = {
    development: {
        client: "mysql",
        connection: {
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        },
        pool: {
            min: 1,
            max: 10,
        },
        migrations: {
            directory: `${__dirname}/config/migrations`,
        },
        seeds: {
            directory: `${__dirname}/config/seeds`,
        },
    },
};
