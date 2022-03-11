const fs = require('fs').promises;
const { google } = require('googleapis');
const { SCOPES, TOKEN_PATH } = require('./constant');
const moment = require('moment');

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

const findFolderOfTheDay = async () => {
    const folderName = `projet-iot${moment().format('YYYY-MM-DD')}`;

    const drive = google.drive({ version: 'v3', auth: driveClient.auth });

    let result;
    try {
        result = await drive.files.list({
            q: "mimeType='application/vnd.google-apps.folder' and trashed=false",
            fields: 'nextPageToken, files(id, name)',
            spaces: 'drive',
        });
    } catch (e) {
        throw e;
    }
    const folder = result.data.files.filter((x) => x.name === folderName);
    return folder.length ? folder[0].id : null;
};

const findPicturesOfTheDay = async (token) => {
    if (!driveClient.auth) await authorize(token);

    const drive = google.drive({ version: 'v3', auth: driveClient.auth });
    const folderId = await findFolderOfTheDay();

    if (!folderId) return;

    let result;
    try {
        result = await drive.files.list({
            q: `mimeType='image/jpeg' and parents in '${folderId}'`,
            pageSize: 10,
            fields: 'nextPageToken, files(id, name)',
        });
    } catch (e) {
        throw e;
    }
    return result.data.files.length ? result.data.files : [];
};

module.exports = {
    getAccessToken,
    getAuthUrl,
    findPicturesOfTheDay,
    authorize,
};
