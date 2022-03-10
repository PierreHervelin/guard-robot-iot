import React from 'react';
import { fetchDriveLogin, fetchDriveLogout, fetchMqttPublish } from '../common/api.services';
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
            await fetchDriveLogout();
        } else {
            await fetchDriveLogin();
        }
    };

    return (
        <div className="navbar">
            <div className="container">
                <div className="item" onClick={onRobotButtonClick}>
                    {config.started ? 'off' : 'on'}
                </div>
                <div className="item" onClick={onLogin}>
                    {config.login ? 'logout' : 'login'}
                </div>
            </div>
        </div>
    );
};

export default NavbarComponent;
