import { createContext, useContext, useReducer } from 'react';
import { RobotActions } from '../common/constant';
import Cookies from 'js-cookie';

const initialState = {
    login: false,
    started: false,
    token: null,
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'login':
            return {
                ...state,
                login: true,
                token: JSON.parse(Cookies.get('token')),
            };
        case 'logout':
            return {
                ...state,
                login: false,
                token: null,
            };
        case RobotActions.start:
            return {
                ...state,
                started: true,
            };
        case RobotActions.stop:
            return {
                ...state,
                started: false,
            };
        default:
            return state;
    }
};

const ConfigContext = createContext();

export const ConfigConsumerHook = () => useContext(ConfigContext);
export const ConfigProvider = ({ children }) => <ConfigContext.Provider value={useReducer(reducer, initialState)}>{children}</ConfigContext.Provider>;
