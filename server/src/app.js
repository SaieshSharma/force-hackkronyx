import express from "express";
import helmet from 'helmet';
import mongoose from "mongoose";
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from "cors";
// import {userRoutes} from "./routes/user.routes.js";
import errorHandler from "./middlewares/errorHandler.middleware.js"; // Centralized error handler
import  ApiError from './utils/ApiError.js';

const app = express();

// Middleware
app.use(helmet()); // Security headers

app.use(express.static("public"));
app.use(cors({
 origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.use(express.json({ limit: "60mb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(morgan('dev')); // Logging
app.use(bodyParser.json());

import machineRoutes from './routes/machineRoutes.js';


app.use('/api/machines', machineRoutes);


// API routes

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// 404 handler
app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// Error handling middleware
app.use(errorHandler);


export default app;
