const setupSSE = (res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();
};

const sendEvent = (res, data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
};

const closeSSE = (res) => {
    res.write(`data: [DONE]\n\n`);
    res.end();
};

module.exports = {
    setupSSE,
    sendEvent,
    closeSSE
};
