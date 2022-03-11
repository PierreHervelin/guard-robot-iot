import Cookies from 'js-cookie';
import React, { useEffect } from 'react';
import { checkToken } from '../common/helpers';
import NavbarComponent from '../components/navbar.component';
import { ConfigConsumerHook } from '../store/config.store';
import { ImImages } from 'react-icons/im';
import MqttLogsComponent from '../components/mqtt-logs.component';

const DashboardPage = () => {
    // eslint-disable-next-line no-unused-vars
    const [config, dispatch] = ConfigConsumerHook();

    useEffect(() => {
        if (checkToken()) {
            dispatch({ type: 'login' });
        } else {
            dispatch({ type: 'logout' });
            Cookies.remove('token');
        }
    }, [dispatch]);

    return (
        <div className="dashboard">
            <NavbarComponent />
            <MqttLogsComponent />
            <div className="card">
                <ImImages />
            </div>
        </div>
    );
};

export default DashboardPage;
