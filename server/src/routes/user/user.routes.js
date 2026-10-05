import express from 'express';
import * as user from '../../controller/user/user.controller.js';

const userRoutes = express.Router();

userRoutes.post('/create-user', user.createUser)
userRoutes.post('/upsert-user/:id', user.upsertByAuthId)
userRoutes.get('/get-user/:id', user.getUserByAuthId)
userRoutes.get('/get-users', user.getUsers)
userRoutes.patch('/update-user', user.updateUser)

export default userRoutes;