const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const corsOptions = {
    origin: true,
    credentials: true,
};
app.use(cors(corsOptions));

// routers
const mqttRouter = require('./mqtt/mqtt.controller');
const driveRouter = require('./drive/drive.controller');

const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/mqtt', mqttRouter);
app.use('/drive', driveRouter);

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});

module.exports = {
    app,
};
