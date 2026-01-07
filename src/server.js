const app = require('./app');
const connectDB = require('./config/db');
const { port } = require('./config/env');

connectDB();

app.listen(port, () => {
    console.log(`OpsMind AI running on port ${port} 🚀`);
});
