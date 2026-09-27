import jwt from "jsonwebtoken";

export const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "2h",
        }
    );
};