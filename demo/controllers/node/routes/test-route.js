const path = require("path");
const express = require("express");
const TestRouter = express.Router();
const logger = require(path.join(__dirname, "..", "config", "logger")).getLogger;

TestRouter.post("/", (request, response) => {
    try {
        // TODO: Send request to agent
        response.status(200).send("Server running.");
    } catch (err) {
        logger.error(`POST / - ${err.message}`);
        response.status(400).send({ error: 400, message: err.message });
    }
});

module.exports = TestRouter;
