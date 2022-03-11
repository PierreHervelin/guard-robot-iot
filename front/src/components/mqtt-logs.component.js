import React, { useEffect, useState } from 'react';
import { fetchMqttSubscribe, fetchMqttLogs } from '../common/api.services';
import { Topics } from '../common/constant';

const MqttLogsComponent = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        fetchMqttSubscribe(Topics.alerts);
        setInterval(async () => {
            const requestLogs = await fetchMqttLogs();
            setLogs(requestLogs);
        }, 1500);
    }, []);

    return (
        <div className="mqtt-com">
            <h3>MQTT Logs</h3>
            <div className="logs">
                {logs.map((log, i) => (
                    <span className="log" key={i}>
                        {log}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default MqttLogsComponent;
