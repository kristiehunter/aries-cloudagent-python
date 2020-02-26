const path = require("path");
const express = require("express");
const TopicRouter = express.Router();
const logger = require(path.join(__dirname, "..", "config", "logger")).getLogger("Topic-Route");


TopicRouter.post("/connections", (request, response) => {
    logger.info(JSON.stringify(request.body));
    response.status(200).send();
});

TopicRouter.post("/", (request, response) => {
    logger.info(request.body);
    response.send("ok");
});


module.exports = TopicRouter;
