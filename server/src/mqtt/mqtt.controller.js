const express = require('express');
const mqtt = require('mqtt');
const { publish, subscribe } = require('./mqtt.service');

const mqttRouter = express.Router();

// client mqtt connection
const host = process.env.HOST_NAME;
const mqttPort = process.env.PORT;

const connectUrl = `mqtt://${host}:${mqttPort}`;

const client = mqtt.connect(connectUrl, {
    clean: true,
    connecTimeout: 4000,
    reconnectPeriod: 1000,
});
client.on('connect', () => {
    console.log(`client connected on ${host} port: ${mqttPort}`);
});
client.on('message', (topic, payload) => {
    console.log(`Message received: '${payload}' on ${topic}`);
});

mqttRouter.get('/publish', async (req, res) => {
    const topic = req.query.topic;
    const payload = req.query.payload;

    if (topic && payload) {
        try {
            await publish(client, topic, payload);
            res.sendStatus(200);
            return;
        } catch (e) {
            res.sendStatus(500);
            throw e;
        }
    }
    console.error('topic or payload undefined');
    res.sendStatus(403);
});

mqttRouter.get('/subscribe', async (req, res) => {
    const topic = req.query.topic;

    if (topic) {
        try {
            await subscribe(client, topic);
            res.sendStatus(200);
            return;
        } catch (e) {
            res.sendStatus(500);
            throw e;
        }
    }
    console.error('topic undefined');
    res.sendStatus(403);
});

module.exports = mqttRouter;
