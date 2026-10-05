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
        const query = req.query;
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