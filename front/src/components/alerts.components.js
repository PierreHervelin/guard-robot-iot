import React, { useEffect, useState } from 'react';
import { fetchMqttPayloads } from '../common/api.services';
import { Topics } from '../common/constant';

const AlertsComponents = () => {
    const [alerts, setAlerts] = useState([]);

    const setAlertsWithData = async () => {
        const alerts = await fetchMqttPayloads(Topics.alerts);
        setAlerts(alerts);
    };
    useEffect(() => {
        setAlertsWithData();
    }, []);
    if (alerts.length > 0) {
        return (
            <div className="alerts-container">
                <h3>Alerts</h3>
                <div className="alerts">
                    {alerts.map((alert, i) => (
                        <span className="alert" key={i}>
                            {alert}
                        </span>
                    ))}
                </div>
            </div>
        );
    } else {
        return (
            <div className="alerts-container">
                <h3>Alerts</h3>
                <p>0 alerts found</p>
            </div>
        );
    }
};

export default AlertsComponents;
