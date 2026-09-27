import express from 'express';
import cookieParser from "cookie-parser";
import authRoutes from './routes/auth/auth.routes.js';
import cors from 'cors'
import { corsConfig } from './config/cors.config.js';

const app = express();

// Middlewares
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes)

// Health check
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is running",
    });
});

export default app;