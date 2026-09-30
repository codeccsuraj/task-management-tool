import AuthModel from "../../model/auth/auth.model.js";
import UserModel from "../../model/user/model/user.model.js";
import mongoose from 'mongoose'

class UserServices {
    async createUser(parentId, payload) {
        const {
            email,
            password,
            full_name,
            phone,
            role,
        } = payload;

        // ------------------------------------
        // Validate parentId
        // ------------------------------------

        if (
            !parentId ||
            !mongoose.Types.ObjectId.isValid(parentId)
        ) {
            return {
                status: 400,
                success: false,
                message: "Please provide a valid auth id",
            };
        }


        const normalizedEmail = email
            .trim()
            .toLowerCase();

        const normalizedPhone = phone.trim();

        const parentObjectId = new mongoose.Types.ObjectId(
            parentId
        );


        try {

            const existingEmail = await AuthModel.findOne({
                email: normalizedEmail,
            })

            if (existingEmail) {
                return {
                    status: 409,
                    success: false,
                    message: "User already exists with this email",
                };
            }

            const existingPhone = await UserModel.findOne({
                phone: normalizedPhone,
            })

            if (existingPhone) {
                return {
                    status: 409,
                    success: false,
                    message: "User already exists with this phone",
                };
            }

            // ------------------------------------
            // Create Auth
            // ------------------------------------

            const auth = await AuthModel.create({
                email: normalizedEmail,
                password,
                parentId: parentObjectId,
            });

            // ------------------------------------
            // Create User Document
            // ------------------------------------

            const user = await UserModel.create({
                authId: auth._id,
                full_name: full_name.trim(),
                phone: normalizedPhone,
                role: role.trim(),
            });

            // ------------------------------------
            // Commit
            // ------------------------------------

            return {
                status: 201,
                success: true,
                message: "Member created successfully",
                data: {
                    auth: {
                        id: auth._id,
                        email: auth.email,
                        parentId: auth.parentId,
                    },
                    user,
                },
            };

        } catch (error) {
            console.error(
                "Create member error:",
                error
            );

            return {
                status: 500,
                success: false,
                message: "Failed to create member",
            };

        }
    }

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

    async getUsers(parentId) {
        try {
            if (!mongoose.Types.ObjectId.isValid(parentId)) {
                return {
                    status: 400,
                    success: false,
                    message: "Invalid parent ID",
                };
            }

            const parentObjectId = new mongoose.Types.ObjectId(parentId);

            const users = await AuthModel.aggregate([
                {
                    $match: {
                        parentId: parentObjectId,
                    },
                },

                {
                    $lookup: {
                        from: "UserDocument",
                        localField: "_id",
                        foreignField: "authId",
                        as: "user",
                    },
                },

                {
                    $unwind: {
                        path: "$user",
                        preserveNullAndEmptyArrays: true,
                    },
                },

                {
                    $project: {
                        _id: 1,
                        email: 1,
                        parentId: 1,
                        createdAt: 1,

                        user: 1,
                    },
                },
            ]);

            if (!users || users?.length === 0) {
                return {
                    status: 404,
                    success: false,
                    message: "No users found",
                    data: [],
                };
            }

            return {
                status: 200,
                success: true,
                message: "Users fetched successfully",
                data: users,
            };
        } catch (error) {
            console.error("Get users error:", error);

            return {
                status: 500,
                success: false,
                message: "Failed to fetch users",
            };
        }
    }
}

export const userService = new UserServices();