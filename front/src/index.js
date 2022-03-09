import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './style/index.scss';
import App from './app.router';
import { ConfigProvider } from './store/config.store';

ReactDOM.render(
    <ConfigProvider>
        <Router>
            <App />
        </Router>
    </ConfigProvider>,
    document.getElementById('root'),
);
