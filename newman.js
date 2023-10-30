const newman = require("newman");

newman.run(
    {
        collection: "./collection_postman/Final Test Sprint 1.postman_collection.json",
        reporters: ["htmlextra"],
        environment: "./collection_postman/Manage User System.postman_environment.json",
        iterationCount: 1,
        reporter: {
            htmlextra: {
                export: "./reports/newman/report.html",
            },
        },
    },
    (err) => {
        if (err) {
            throw err;
        }
        console.log("collection run complete!");
    },
);
