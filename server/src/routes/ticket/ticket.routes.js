import express from 'express';
import * as ticket from '../../controller/ticket/ticket.controller.js';

const ticketRoutes = express.Router();

ticketRoutes.post("/create-project", ticket.createProject)
ticketRoutes.get("/get-projects", ticket.getMyProjects)

export default ticketRoutes;