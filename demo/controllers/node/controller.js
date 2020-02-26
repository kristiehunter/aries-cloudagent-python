// ========================= //
//        Requirements       //
// ========================= //
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const helmet = require("helmet");
const http = require("http");
const path = require("path");

require("dotenv").config({});

const config = require(path.join(__dirname, "config", "logger"));
const logger = config.getLogger("App-Base");

// == Routes == //
const agentRoute = require(path.join(__dirname, "routes", "agent-route"));
const topicRoute = require(path.join(__dirname, "routes", "topic-route"));

// Separate test endpoint ONLY for test environment
if (process.env.NODE_ENV === "test") {
    const testRoute = require(path.join(__dirname, "routes", "test-route"));
    app.use("/test", testRoute);
}

// ========================= //
//  Application Environment  //
// ========================= //

// Express App
const port = process.env.PORT || 5000;

logger.info("\n====================\n  APP STARTING\n====================");

const server = http.createServer(app).listen(port);
logger.info("\n= = = = = = = = = = =\n   Server Starting\n= = = = = = = = = = =");
logger.info(`Port Number: ${port}`);
server.timeout = 60000;

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/agent", agentRoute);
app.use("/topic", topicRoute);
