import { ticketService } from "../../service/ticket/ticket.service.js";
import { decodeToken } from "../../utils/jwt.js";

export const createProject = async (req, res) => {
    try {
        const data = req.body;
        const token = req.cookies.accessToken;
        const user = decodeToken(token);

        const result = await ticketService.createProject(data, user?.id);

        return res.status(result.status).json(result);
    } catch (error) {
        console.error("UserController createProject error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while adding data",
        });
    }
}

export const getMyProjects = async (req, res) => {
    try {
        const query = req.query;
        const token = req.cookies.accessToken;
        const user = decodeToken(token);

        const result = await ticketService.getMyProjects(user?.id, query);

        return res.status(result.status).json(result);
    } catch (error) {
        console.error("UserController getMyProjects error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching data",
        });
    }
}

export const getMemberProjects = async (req, res) => {
    try {
        const token = req.cookies.accessToken;
        const user = decodeToken(token);

        const result = await ticketService.getMemberProjects(user?.id);

        return res.status(result.status).json(result);
    } catch (error) {
        console.error("UserController getMyProjects error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching data",
        });
    }
}

export const createTicket = async (req, res) => {
    try {
        const token = req.cookies.accessToken;
        const user = decodeToken(token);
        const data = req.body;

        const result = await ticketService.createTicket(data, user?.id);

        return res.status(result.status).json(result);
    } catch (error) {
        console.error("UserController createTicket error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating data",
        });
    }
}

export const createSprint = async (req, res) => {
    try {
        const data = req.body;
        const result = await ticketService.createSprint(data);

        return res.status(result.status).json(result)
    } catch (error) {
        console.error("Create Sprint Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong while creating sprint",
        })
    }
}

export const getSprintByProjectId = async (req, res) => {
    try {
        const { projectKey } = req.params;
        const result = await ticketService.getSprintByProjectId(projectKey);

        return res.status(result.status).json(result)
    } catch (error) {
        console.error("Create Sprint Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong while creating sprint",
        })
    }
}
export const getProjectTeam = async (req, res) => {
    try {
        const { projectId } = req.params;
        const result = await ticketService.getProjectTeam(projectId);

        return res.status(result.status).json(result)
    } catch (error) {
        console.error("Create Sprint Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong while creating sprint",
        })
    }
}

export const getTicketByProjectId = async (req, res) => {
    try {
        const query = req.query;
        const result = await ticketService.getTicketByProjectId(query);

        return res.status(result.status).json(result)
    } catch (error) {
        console.error("Create Sprint Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong while creating sprint",
        })
    }
}

export const getTicketById = async (req, res) => {
    try {
        const {ticketId} = req.params;
        const result = await ticketService.getTicketById(ticketId);

        return res.status(result.status).json(result)
    } catch (error) {
        console.error("Create Sprint Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong while creating sprint",
        })
    }
}