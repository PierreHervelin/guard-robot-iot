import Cookies from 'js-cookie';
import React, { useEffect } from 'react';
import { checkToken } from '../common/helpers';
import NavbarComponent from '../components/navbar.component';
import { ConfigConsumerHook } from '../store/config.store';
import { ImImages } from 'react-icons/im';
import MqttLogsComponent from '../components/mqtt-logs.component';
import AlertsComponents from '../components/alerts.components';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    // eslint-disable-next-line no-unused-vars
    const [config, dispatch] = ConfigConsumerHook();

    const navigate = useNavigate();

    useEffect(() => {
        if (checkToken()) {
            dispatch({ type: 'login' });
        } else {
            dispatch({ type: 'logout' });
            Cookies.remove('token');
        }
    }, [dispatch]);

    return (
        <div className="page">
            <MqttLogsComponent />
            <div className="card" onClick={() => navigate('/gallery')}>
                <ImImages />
            </div>
            <AlertsComponents />
            <NavbarComponent />
        </div>
    );
};

export default DashboardPage;
