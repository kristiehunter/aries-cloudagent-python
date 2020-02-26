const path = require("path");
const express = require("express");
const requestPromise = require("request-promise-native");
const AgentRouter = express.Router();
const logger = require(path.join(__dirname, "..", "config", "logger")).getLogger("Agent-Route");
const AriesHost = process.env.AGENT_URL;

AgentRouter.post("/issue/credential", (request, response) => {
    response.status(200).send({ temporary: "temporary "});
});

AgentRouter.post("/issue/proof", (request, response) => {
    response.status(200).send({ temporary: "temporary "});
});

AgentRouter.post("/request/proof", (request, response) => {
    response.status(200).send({ temporary: "temporary "});
});

AgentRouter.post("/issue/message", async (request, response) => {
    try {
        let message = await requestPromise({
            uri: `${AriesHost}/connections/${request.body.connectionID}/send-message`,
            method: "POST", body: JSON.stringify({ content: request.body.message }),
            resolveWithFullResponse: true });
        let data = JSON.parse(message.body);

        response.status(200).send({ message: data });

    } catch (err) {
        logger.error(`POST /issue/message - ${err.message}`);
        response.status(400).send({ error: 400, message: err.message });
    }
});

AgentRouter.post("/request/connection", async (request, response) => {
    try {
        let invitation = await requestPromise({
            uri: `${AriesHost}/connections/create-invitation`, method: "POST",
            resolveWithFullResponse: true });
        let data = JSON.parse(invitation.body);

        let connectionID = data.connection_id;
        let recipientKeys = data.invitation.recipientKeys;
        let invitationURL = data.invitation_url;

        response.status(200).send({ message: connectionID });

    } catch (err) {
        logger.error(`POST /request/connection - Create Invitation - ${err.message}`);
        response.status(400).send({ error: 400, message: err.message });
    }
});

AgentRouter.post("/webhook", async (_, response) => {
    const url = `http://${process.env.DOCKERHOST}:${process.env.PORT}`;
    logger.debug(`URL for controller: ${url}`);
    logger.debug(`URL for agent: ${AriesHost}/webhooks/register`);

    try {
        let register = await requestPromise({
            uri: `${AriesHost}/webhooks/register`, method: "POST",
            body: JSON.stringify({ url }),
            resolveWithFullResponse: true });
        let data = JSON.parse(register.body);

        response.status(200).send({ registered: data });
    } catch (err) {
        logger.error(`POST /webhook - ${err.message}`);
        response.status(400).send({ error: 400, message: err.message });
    }
});


module.exports = AgentRouter;
