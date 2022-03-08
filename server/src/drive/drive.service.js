const fs = require('fs').promises;
const readline = require('readline');
const { google } = require('googleapis');
const { SCOPES, TOKEN_PATH } = require('./constant');

const driveClient = {
    auth: null,
};

const authorize = async () => {
    let credentialsData;
    try {
        credentialsData = await fs.readFile('credentials.json', 'utf8');
    } catch (e) {
        console.log('Error loading client secret file:', e);
        throw e;
    }
    // Authorize a client with credentials, then call the Google Drive API.
    const credentials = JSON.parse(credentialsData);
    driveClient.auth = new google.auth.OAuth2(credentials.client_id, credentials.client_secret, credentials.redirect_uris[0]);

    let tokenData;
    // Check if we have previously stored a token.
    try {
        tokenData = await fs.readFile(TOKEN_PATH, 'utf8');
    } catch (e) {
        getAccessToken();
        return;
    }
    const token = JSON.parse(tokenData);
    if (new Date(token.expiry_date).getTime() < new Date().getTime()) return getAccessToken();
    driveClient.auth.setCredentials(token);
};

const getAccessToken = () => {
    const authUrl = driveClient.auth.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        driveClient.auth.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            driveClient.auth.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
        });
    });
};

const listFiles = () => {
    const drive = google.drive({ version: 'v3', auth: driveClient.auth });
    drive.files.list(
        {
            pageSize: 10,
            fields: 'nextPageToken, files(id, name)',
        },
        (err, res) => {
            if (err) return console.log('The API returned an error: ' + err);
            const files = res.data.files;
            if (files.length) {
                console.log('Files:');
                files.map((file) => {
                    console.log(`${file.name} (${file.id})`);
                });
            } else {
                console.log('No files found.');
            }
        },
    );
};

module.exports = {
    getAccessToken,
    listFiles,
    authorize,
};
