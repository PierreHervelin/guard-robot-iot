const fs = require('fs').promises;
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
        throw e;
    }
    const token = JSON.parse(tokenData);
    if (new Date(token.expiry_date).getTime() < new Date().getTime()) throw new Error('ExpiredToken');
    driveClient.auth.setCredentials(token);
    console.log('Google Client connected');
};

const disconnect = async () => {
    try {
        await fs.unlink(TOKEN_PATH);
        console.log('Google Client disconnected');
    } catch (e) {
        throw e;
    }
};

const getAuthUrl = () => {
    const authUrl = driveClient.auth.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    return authUrl;
};

const getAndWriteAccessToken = (code) => {
    return new Promise((resolve, reject) => {
        driveClient.auth.getToken(code, async (err, token) => {
            if (err) reject(err);
            driveClient.auth.setCredentials(token);
            // Store the token to disk for later program executions
            try {
                await fs.writeFile(TOKEN_PATH, JSON.stringify(token));
                console.log(`token store to ${TOKEN_PATH}`);
            } catch (e) {
                reject(e);
            }
            resolve();
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
    getAndWriteAccessToken,
    getAuthUrl,
    listFiles,
    authorize,
    disconnect,
};
