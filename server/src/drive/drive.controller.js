const { authorize, getAuthUrl, getAndWriteAccessToken, disconnect } = require('./drive.service');
const express = require('express');

const driveRouter = express.Router();

driveRouter.get('/login', async (req, res) => {
    try {
        await authorize();
        res.status(200).redirect(process.env.REDIRECT_URI);
    } catch (e) {
        res.redirect(getAuthUrl());
    }
});
driveRouter.get('/logout', async (req, res) => {
    try {
        await disconnect();
        res.status(200).redirect(process.env.REDIRECT_URI);
    } catch (e) {
        res.sendStatus(500);
        throw e;
    }
});
driveRouter.get('/token', async (req, res) => {
    const code = req.query.code;
    try {
        await getAndWriteAccessToken(code);
        res.status(200).redirect(process.env.REDIRECT_URI);
    } catch (e) {
        res.sendStatus(500);
        throw e;
    }
});

module.exports = driveRouter;
