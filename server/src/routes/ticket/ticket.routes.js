import express from 'express';
import * as ticket from '../../controller/ticket/ticket.controller.js';

const ticketRoutes = express.Router();

ticketRoutes.post("/create-project", ticket.createProject)
ticketRoutes.get("/get-projects", ticket.getMyProjects)
ticketRoutes.get("/get-member/:projectId", ticket.getProjectTeam)

ticketRoutes.post("/create-sprint", ticket.createSprint)

export default ticketRoutes;