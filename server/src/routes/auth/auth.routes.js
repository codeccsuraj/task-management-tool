import express from 'express';
import * as auth from '../../controller/auth/auth.controller.js';

const authRoutes = express.Router();

authRoutes.post("/create", auth.createAuth);
authRoutes.post("/login", auth.loginAuth);
authRoutes.post("/logout", auth.logout);

export default authRoutes;