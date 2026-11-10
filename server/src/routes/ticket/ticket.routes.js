import express from 'express';
import * as ticket from '../../controller/ticket/ticket.controller.js';
import { uploadMiddleware } from '../../middleware/upload.middleware.js';

const ticketRoutes = express.Router();

ticketRoutes.post("/create-project", ticket.createProject)
ticketRoutes.get("/get-projects", ticket.getMyProjects)
ticketRoutes.get("/get-member/:projectId", ticket.getProjectTeam)
ticketRoutes.get("/get-member-projects", ticket.getMemberProjects)
ticketRoutes.get("/get-projects-sprint/:projectKey", ticket.getSprintByProjectId)
ticketRoutes.patch("/add-member/:projectId", ticket.updateMemberProject)

ticketRoutes.post("/create-sprint", ticket.createSprint)
ticketRoutes.post("/create-ticket", ticket.createTicket)

ticketRoutes.get("/get-tickets", ticket.getTicketByProjectId);
ticketRoutes.get("/get-ticket/:ticketId", ticket.getTicketById);
ticketRoutes.patch("/update-ticket", uploadMiddleware.multiple({
    fieldName: "attachments",
    folder: "tickets/attachments",
    maxFiles: 10,
    maxFileSize: 5 * 1024 * 1024
}), ticket.updateTicketFields);

ticketRoutes.get("/get-history/:ticketId", ticket.getHistoryByTicketId);

export default ticketRoutes;