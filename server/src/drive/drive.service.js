const fs = require('fs').promises;
const { google } = require('googleapis');
const { SCOPES, TOKEN_PATH } = require('./constant');

const driveClient = {
    auth: null,
};

const getCredentials = async () => {
    let credentialsData;
    try {
        credentialsData = await fs.readFile('credentials.json', 'utf8');
    } catch (e) {
        console.log('Error loading client secret file:', e);
        throw e;
    }
    // Authorize a client with credentials, then call the Google Drive API.
    const credentials = JSON.parse(credentialsData);

    return credentials;
};

const authorize = async (token) => {
    if (!token) throw new Error('TokenUndefined');

    const credentials = await getCredentials();
    driveClient.auth = new google.auth.OAuth2(credentials.client_id, credentials.client_secret, credentials.redirect_uris[0]);

    if (new Date(token.expiry_date).getTime() < new Date().getTime()) throw new Error('ExpiredToken');
    driveClient.auth.setCredentials(token);
    console.log('Google Client connected');
};

const getAuthUrl = async () => {
    if (!driveClient.auth) {
        const credentials = await getCredentials();
        driveClient.auth = new google.auth.OAuth2(credentials.client_id, credentials.client_secret, credentials.redirect_uris[0]);
    }
    const authUrl = driveClient.auth.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    return authUrl;
};

const getAccessToken = (code) => {
    return new Promise((resolve, reject) => {
        driveClient.auth.getToken(code, async (err, token) => {
            if (err) reject(err);
            driveClient.auth.setCredentials(token);
            resolve(token);
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
    getAuthUrl,
    listFiles,
    authorize,
};
