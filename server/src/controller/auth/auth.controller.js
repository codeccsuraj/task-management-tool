import { authService } from "../../service/auth/auth.service.js";

export const createAuth = async (req, res) => {
    try {
        const data = req.body;
        const result = await authService.create(data);
        if (!result.success) {
            return res.status(result.status).json({
                success: false,
                message: result.message,
            });
        };

        if (result.success) {
            res.cookie("accessToken", result.data.token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 24 * 60 * 60 * 1000,
            });
        }

        return res.status(result.status).json({
            success: true,
            message: result.message,
            data: {
                user: result.data.user,
            },
        });
    } catch (error) {
        console.error("Error in create controller:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const loginAuth = async (req, res) => {
    try {
        const data = req.body;
        const result = await authService.login(data);
        if (!result.success) {
            return res.status(result.status).json({
                success: false,
                message: result.message,
            });
        };

        if (result.success) {
            res.cookie("accessToken", result.data.token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 24 * 60 * 60 * 1000,
            });
        }

        return res.status(result.status).json({
            success: true,
            message: result.message,
            data: {
                user: result.data.user,
            },
        });
    } catch (error) {
        console.error("Error in create controller:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        return res.status(result.status).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        console.error("Logout controller error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while logging out",
        });
    }
};