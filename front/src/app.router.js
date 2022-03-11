import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/dashboard.page';
import GalleryPage from './pages/gallery.page';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
        </Routes>
    );
};

export default App;
