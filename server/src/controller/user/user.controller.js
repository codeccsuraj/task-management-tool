import { userService } from "../../service/user/user.service.js";
import { decodeToken } from "../../utils/jwt.js";

export const createUser = async (req, res) => {
    try {
        const token = req.cookies.accessToken;

        const user = decodeToken(token);
        const data = req.body;

        const result = await userService.createUser(user.id, data);

        return res.status(result.status).json(result)
    } catch (error) {
        console.error("UserController createUser error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while adding data",
        });
    }
};

export const getUsers = async (req, res) => {
    try {
        const token = req.cookies.accessToken;
        const query = req.query;
        const user = decodeToken(token);
        const result = await userService.getUsers(user.id, query);

        return res.status(result.status).json(result)
    } catch (error) {
        console.error("UserController getUsers error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while adding data",
        });
    }
};

export const upsertByAuthId = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const result = await userService.upsertByAuthId(id, data);

        return res.status(result.status).json(result)
    } catch (error) {
        console.error("Logout controller error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while adding data",
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const token = req.cookies.accessToken;

        const user = decodeToken(token);
        const data = req.body;

        const result = await userService.updateUser(user?.id, data);

        return res.status(result.status).json(result)
    } catch (error) {
        console.error("Logout controller error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while adding data",
        });
    }
};

export const getUserByAuthId = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await userService.getUserByAuthId(id);

        return res.status(result.status).json(result)
    } catch (error) {
        console.error("getUserByAuthId error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while getting data",
        });
    }
}