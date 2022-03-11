import Cookies from 'js-cookie';
import React from 'react';
import { fetchDriveLogin, fetchMqttPublish } from '../common/api.services';
import { RobotActions, Topics } from '../common/constant';
import { ConfigConsumerHook } from '../store/config.store';

const NavbarComponent = () => {
    const [config, dispatch] = ConfigConsumerHook();

    const onRobotButtonClick = async () => {
        if (config.started) {
            await fetchMqttPublish(Topics.robot, RobotActions.stop);
            dispatch({ type: RobotActions.stop });
        } else {
            await fetchMqttPublish(Topics.robot, RobotActions.start);
            dispatch({ type: RobotActions.start });
        }
    };

    const onLogin = async () => {
        if (config.login) {
            dispatch({ type: 'logout' });
            Cookies.remove('token');
        } else {
            await fetchDriveLogin();
        }
    };

    return (
        <div className="navbar">
            <h2>Guard Robot</h2>
            <div className="container">
                <div className={`item start-button ${config.started ? 'on' : 'off'}`} onClick={onRobotButtonClick}>
                    {config.started ? 'off' : 'on'}
                </div>
                <div className="item login-button" onClick={onLogin}>
                    {config.login ? 'logout' : 'login'}
                </div>
            </div>
        </div>
    );
};

export default NavbarComponent;
