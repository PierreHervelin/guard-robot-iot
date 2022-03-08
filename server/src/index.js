const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

// routers
const mqttRouter = require('./mqtt/mqtt.controller');
const driveRouter = require('./drive/drive.controller');

//init express
const app = express();
const port = 3000;

app.use(cors());
app.use('/mqtt', mqttRouter);
app.use('/drive', driveRouter);

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});

module.exports = {
    app,
};
