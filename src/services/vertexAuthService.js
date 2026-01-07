const { GoogleAuth } = require('google-auth-library');
const fs = require('fs');

const auth = new GoogleAuth({
    keyFile: 'vertex-sa.json',
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
});

const getAccessToken = async () => {
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    return tokenResponse.token;
};

console.log("Vertex SA exists:", fs.existsSync('vertex-sa.json'));

module.exports = { getAccessToken };
