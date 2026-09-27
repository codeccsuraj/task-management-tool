import http from 'http';
import { config } from './config/var.config.js';
import connectDB from './connection/mongo.connection.js';
import app from './index.js';

const server = http.createServer(app);
const PORT = config.ServerPort;

const startServer = async () => {
    try {
        await connectDB();

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();