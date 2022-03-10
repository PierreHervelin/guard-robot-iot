import Cookies from 'js-cookie';
import React, { useEffect } from 'react';
import { checkToken } from '../common/helpers';
import NavbarComponent from '../components/navbar.component';
import { ConfigConsumerHook } from '../store/config.store';

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
        <div>
            <NavbarComponent />
        </div>
    );
};

export default DashboardPage;
