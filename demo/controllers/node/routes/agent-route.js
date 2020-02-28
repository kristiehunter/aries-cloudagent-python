const path = require("path");
const express = require("express");
const requestPromise = require("request-promise-native");
const AgentRouter = express.Router();
const logger = require(path.join(__dirname, "..", "config", "logger")).getLogger("Agent-Route");
const AriesHost = process.env.AGENT_URL;

AgentRouter.post("/issue/connection", async (request, response) => {
    try {
        let invitation = await requestPromise({
            uri: `${AriesHost}/connections/create-invitation`, method: "POST",
            resolveWithFullResponse: true });
        let data = JSON.parse(invitation.body);

        process.env.CONNECTION_ID = data.connection_id;
        process.env.RECIPIENT_KEYS = data.invitation.recipientKeys;
        process.env.INVITATION_URL = data.invitation_url;

        let message = {
            connectionID: data.connection_id,
            invitation: data.invitation
        };

        response.status(200).send(message);

    } catch (err) {
        logger.error(`POST /issue/connection - ${err.message}`);
        response.status(400).send({ error: 400, message: err.message });
    }
});


AgentRouter.post("/accept/connection", async (request, response) => {
    try {
        let invitation = request.body.invitation;
        logger.debug(invitation);
        let accept = await requestPromise({
            uri: `${AriesHost}/connections/receive-invitation`, method: "POST",
            resolveWithFullResponse: true, body: JSON.stringify(invitation)
        });

        response.status(200).send({ invitation: accept });

    } catch (err) {
        logger.error(`POST /accept/connection - ${err.message}`);
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
