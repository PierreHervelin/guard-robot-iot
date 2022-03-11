import axios from 'axios';
import moment from 'moment';

export const fetchMqttPublish = async (topic, payload) => {
    try {
        await axios.get(process.env.REACT_APP_API_URI + process.env.REACT_APP_API_URI_MQTT_PUBLISH, { params: { topic, payload } });
        console.log(`${payload} published on ${topic}`);
    } catch (e) {
        throw e;
    }
};

export const fetchMqttSubscribe = async (topic) => {
    try {
        await axios.get(process.env.REACT_APP_API_URI + process.env.REACT_APP_API_URI_MQTT_SUBSCRIBE, { params: { topic } });
        console.log(`Subscribe on ${topic}`);
    } catch (e) {
        throw e;
    }
};

export const fetchMqttLogs = async () => {
    try {
        const request = await axios.get(process.env.REACT_APP_API_URI + process.env.REACT_APP_API_URI_MQTT_LOGS, {
            params: { startDate: moment().subtract(1, 'hour').valueOf(), endDate: moment().valueOf() },
        });
        return request.data;
    } catch (e) {
        throw e;
    }
};

export const fetchDriveLogin = async () => {
    try {
        const url = await axios.get(process.env.REACT_APP_API_URI + process.env.REACT_APP_API_URI_DRIVE_LOGIN);
        window.location.href = url.data;
    } catch (e) {
        throw e;
    }
};
