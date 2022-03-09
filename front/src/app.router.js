import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/dashboard.page';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<DashboardPage />} />
        </Routes>
    );
};

export default App;
