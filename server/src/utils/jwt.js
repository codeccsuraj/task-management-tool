import jwt from "jsonwebtoken";
import { config } from "../config/var.config.js";

export const generateToken = (user) => {
    return jwt.sign(
        user,
        config.JwtSecret,
        {
            expiresIn: "2h",
        }
    );
};

export const decodeToken = (token) => {
    try {
        if (!token) {
            return null;
        }

        return jwt.verify(token, config.JwtSecret);
    } catch (error) {
        return null;
    }
}