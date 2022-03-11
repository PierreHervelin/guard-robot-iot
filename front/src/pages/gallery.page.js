import React, { useEffect, useState } from 'react';
import { fetchDriveLogin, fetchDrivePictures } from '../common/api.services';
import { checkToken } from '../common/helpers';
import NavbarComponent from '../components/navbar.component';
import { ConfigConsumerHook } from '../store/config.store';

const GalleryPage = () => {
    const [pictures, setPictures] = useState([]);
    const [config, dispatch] = ConfigConsumerHook();

    const setPicturesWithData = async () => {
        await dispatch({ type: 'login' });
        const pics = await fetchDrivePictures(config.token);
        setPictures(pics);
    };

    useEffect(() => {
        if (checkToken()) {
            setPicturesWithData();
        } else {
            fetchDriveLogin();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    return (
        <div className="page">
            <div className="pic-container">
                {pictures.map((pic, i) => (
                    <img src={`https://drive.google.com/uc?export=view&id=${pic.id}`} alt="" key={i} className="pic" />
                ))}
            </div>
            <NavbarComponent />
        </div>
    );
};

export default GalleryPage;
