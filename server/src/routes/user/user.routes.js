import express from 'express';
import * as user from '../../controller/user/user.controller.js';

const userRoutes = express.Router();

userRoutes.post('/add-user/:id', user.upsertByAuthId)

export default userRoutes;