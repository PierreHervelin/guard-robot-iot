const express = require('express');
const mqtt = require('mqtt');
const { publish, subscribe, getLogs, LogsHistory, MqttTopicsPayloadHistory } = require('./mqtt.service');

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
if (!client.connected || client.disconnected) {
    client.on('connect', () => {
        console.log(`client connected on ${host} port: ${mqttPort}`);
        LogsHistory[new Date().getTime().toString()] = `client connected on ${host} port: ${mqttPort}`;
    });
}

client.on('message', (topic, payload) => {
    console.log(`Message received: '${payload}' on ${topic}`);
    LogsHistory[new Date().getTime().toString()] = `Message received: '${payload}' on ${topic}`;
    if (!MqttTopicsPayloadHistory[topic]) MqttTopicsPayloadHistory[topic] = [];
    MqttTopicsPayloadHistory[topic].push(payload);
});

mqttRouter.get('/publish', async (req, res) => {
    const topic = req.query.topic;
    const payload = req.query.payload;

    if (topic && payload) {
        try {
            await publish(client, topic, payload);
            LogsHistory[new Date().getTime()] = `published ${payload} on topic ${topic}`;
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
            LogsHistory[new Date().getTime().toString()] = `subscribe on topic ${topic}`;
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

mqttRouter.get('/logs', (req, res) => {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    try {
        const logs = getLogs(startDate, endDate);
        res.status(200).send(logs);
    } catch (e) {
        res.sendStatus(500);
        throw e;
    }
});

mqttRouter.get('/payloads', (req, res) => {
    const topic = req.query.topic;
    try {
        res.status(200).send(MqttTopicsPayloadHistory[topic] ? MqttTopicsPayloadHistory[topic] : []);
    } catch (e) {
        res.sendStatus(500);
        throw e;
    }
});

module.exports = mqttRouter;
