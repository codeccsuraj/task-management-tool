import AuthModel from "../../model/auth/auth.model.js";
import { generateToken } from "../../utils/jwt.js";

class AuthService {
    async create(payload) {
        try {
            const isAlreadyExists = await AuthModel.findOne({
                email: payload.email,
            });

            if (isAlreadyExists) {
                return {
                    status: 409,
                    success: false,
                    message: "Email already registered",
                };
            }

            const result = await AuthModel.create(payload);

            if (!result) {
                return {
                    status: 500,
                    success: false,
                    message: "Unable to create user",
                };
            }

            const generatedToken = generateToken({
                id: result._id,
                email: result.email,
            });

            return {
                status: 201,
                success: true,
                message: "User added successfully",
                data: {
                    user: {
                        id: result._id,
                        email: result.email,
                        user_group: result.user_group,
                    },
                    token: generatedToken,
                },
            };
        } catch (error) {
            console.error("Error occurred while adding user:", error);

            return {
                status: 500,
                success: false,
                message: "Something went wrong while adding user",
            };
        }
    }

    async login(payload) {
        try {
            const { email, password } = payload;

            const user = await AuthModel.findOne({ email });

            if (!user) {
                return {
                    status: 401,
                    success: false,
                    message: "Invalid email or password",
                };
            }

            const isPasswordValid = await user.comparePassword(password);

            if (!isPasswordValid) {
                return {
                    status: 401,
                    success: false,
                    message: "Invalid email or password",
                };
            }

            const generatedToken = generateToken({
                id: user._id,
                email: user.email,
            });

            return {
                status: 200,
                success: true,
                message: "Login successful",
                data: {
                    user: {
                        id: user._id,
                        email: user.email,
                        user_group: user.user_group,
                    },
                    token: generatedToken,
                },
            };
        } catch (error) {
            console.error("Error occurred while logging in:", error);

            return {
                status: 500,
                success: false,
                message: "Something went wrong while logging in",
            };
        }
    }
}

export const authService = new AuthService();