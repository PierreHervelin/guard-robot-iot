const { authorize, listFiles } = require('./drive.service');
const express = require('express');

const driveRouter = express.Router();

authorize();

driveRouter.get('/', (req, res) => {
    listFiles();
    res.sendStatus(200);
});

module.exports = driveRouter;
