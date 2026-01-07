const axios = require('axios');
const { geminiKey } = require('../config/env');

const generateEmbedding = async (text) => {
    const url = "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent";

    const response = await axios.post(
        `${url}?key=${geminiKey}`,
        {
            content: { parts: [{ text }] }
        }
    );

    return response.data.embedding.values;
};

module.exports = { generateEmbedding };
