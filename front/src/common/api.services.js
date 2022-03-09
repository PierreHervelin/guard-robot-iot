import axios from 'axios';

export const fetchMqttPublish = async (topic, payload) => {
    try {
        await axios.get(process.env.REACT_APP_API_URI + process.env.REACT_APP_API_URI_MQTT_PUBLISH, { params: { topic, payload } });
        console.log(`${payload} published on ${topic}`);
    } catch (e) {
        throw e;
    }
};
