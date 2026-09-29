import { userService } from "../../service/user/user.service.js";

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