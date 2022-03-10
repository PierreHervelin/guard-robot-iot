const { authorize, getAuthUrl, getAccessToken, disconnect } = require('./drive.service');
const express = require('express');

const driveRouter = express.Router();

driveRouter.get('/login', async (req, res) => {
    const token = req.query.token;
    if (token) {
        try {
            await authorize(token);
            res.cookie('token', JSON.stringify(token), { httpOnly: true });
            res.redirect(200, process.env.REDIRECT_URI);
        } catch (e) {
            res.sendStatus(500);
            throw e;
        }
    } else {
        const url = await getAuthUrl();
        res.status(200).send(url);
    }
});
driveRouter.get('/logout', async (req, res) => {
    try {
        res.clearCookie('token', { httpOnly: true });
        res.redirect(200, process.env.REDIRECT_URI);
    } catch (e) {
        res.sendStatus(500);
        throw e;
    }
});
driveRouter.get('/token', async (req, res) => {
    const code = req.query.code;
    try {
        const token = await getAccessToken(code);
        res.cookie('token', JSON.stringify(token), { httpOnly: true });
        res.redirect(200, process.env.REDIRECT_URI);
    } catch (e) {
        res.sendStatus(500);
        throw e;
    }
});

module.exports = driveRouter;
