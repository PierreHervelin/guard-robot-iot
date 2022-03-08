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

module.exports = {
    publish,
    subscribe,
};
