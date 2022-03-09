import React from 'react';
import { fetchMqttPublish } from '../common/api.services';
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

    return (
        <div className="navbar">
            <div className="container">
                <div className="item" onClick={onRobotButtonClick}>
                    {config.started ? 'off' : 'on'}
                </div>
                <div className="item">login</div>
            </div>
        </div>
    );
};

export default NavbarComponent;
