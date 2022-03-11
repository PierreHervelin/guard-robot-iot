const moment = require('moment');

const publish = async (client, topic, payload) => {
    if (client.connected) {
        try {
            await client.publish(topic, payload);
            console.log(`published ${payload} on topic ${topic}`);
        } catch (e) {
            throw e;
        }
    } else {
        console.error('client not connected');
        throw new Error('ClientDisconnect');
    }
};

const subscribe = async (client, topic) => {
    if (client.connected) {
        try {
            await client.subscribe([topic], () => {
                console.log(`client subscribe to ${topic}`);
            });
        } catch (e) {
            throw e;
        }
    } else {
        console.error('client not connected');
        throw new Error('ClientDisconnect');
    }
};

const getLogs = (startDate, endDate) => {
    let logs = [];
    for (const [date, log] of Object.entries(LogsHistory)) {
        if (Number(date) > Number(startDate) && Number(date) < Number(endDate)) {
            logs.push(`[${moment(Number(date)).format('LTS')}]: ${log}`);
        }
    }
    return logs;
};

const LogsHistory = {};
const MqttTopicsPayloadHistory = {};

module.exports = {
    publish,
    subscribe,
    getLogs,
    LogsHistory,
    MqttTopicsPayloadHistory,
};
