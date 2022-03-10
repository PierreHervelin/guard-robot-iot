import axios from 'axios';
import { getCookie } from './helpers';

export const fetchMqttPublish = async (topic, payload) => {
    try {
        await axios.get(process.env.REACT_APP_API_URI + process.env.REACT_APP_API_URI_MQTT_PUBLISH, { params: { topic, payload } });
        console.log(`${payload} published on ${topic}`);
    } catch (e) {
        throw e;
    }
};

export const fetchDriveLogin = async () => {
    getCookie('token');
    const token = null;
    try {
        await axios.get(process.env.REACT_APP_API_URI + process.env.REACT_APP_API_URI_DRIVE_LOGIN, { params: { token } });
    } catch (e) {
        throw e;
    }
};
export const fetchDriveLogout = async () => {
    try {
        await axios.get(process.env.REACT_APP_API_URI + process.env.REACT_APP_API_URI_DRIVE_LOGOUT);
    } catch (e) {
        throw e;
    }
};
