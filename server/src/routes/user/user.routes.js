import express from 'express';
import * as user from '../../controller/user/user.controller.js';

const userRoutes = express.Router();

userRoutes.post('/add-user/:id', user.upsertByAuthId)
userRoutes.get('/get-user/:id', user.getUserByAuthId)

export default userRoutes;