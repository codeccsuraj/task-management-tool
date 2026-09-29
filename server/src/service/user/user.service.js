import UserModel from "../../model/user/model/user.model.js";

class UserServices {
    async upsertByAuthId(id, data) {
        try {
            if (!id || id.trim() === "") {
                return {
                    status: 400,
                    success: false,
                    message: "Provide valid credentials to update data",
                };
            };

            const result = await UserModel.findOneAndUpdate(
                { authId: id },
                {
                    $set: data,
                    $setOnInsert: {
                        authId: id,
                    },
                },
                {
                    returnDocument: "after",
                    upsert: true,
                    runValidators: true,
                }
            );

            return {
                status: 200,
                success: true,
                message: "User document saved successfully",
                data: result,
            };
        } catch (error) {
            console.error("Error upserting user document:", error);

            return {
                status: 500,
                success: false,
                message: "Failed to save user document",
                error: error.message,
            };
        }
    }

    async getUserByAuthId(id) {
        try {
            if (!id || id.trim() === "") {
                return {
                    status: 400,
                    success: false,
                    message: "Provide valid credentials to get user data",
                };
            }

            const user = await UserModel
                .findOne({ authId: id })
                .populate({
                    path: "authId",
                })
                .lean();

            if (!user) {
                return {
                    status: 404,
                    success: false,
                    message: "User profile not found",
                    data: null,
                };
            }

            return {
                status: 200,
                success: true,
                message: "User data fetched successfully",
                data: user,
            };
        } catch (error) {
            console.error("Error fetching user document:", error);

            return {
                status: 500,
                success: false,
                message: "Failed to fetch user data",
                error: error.message,
            };
        }
    }
}

export const userService = new UserServices();