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
            user_group
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
                user_group
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

    async updateUser(authId, payload) {
        try {
            const {
                full_name,
                role,
                user_group,
            } = payload;

            // ------------------------------------
            // Validate parent authId
            // ------------------------------------

            if (
                !authId ||
                !mongoose.Types.ObjectId.isValid(authId)
            ) {
                return {
                    status: 400,
                    success: false,
                    message: "Please provide a valid auth id",
                };
            }

            const parentObjectId = new mongoose.Types.ObjectId(authId);

            // ------------------------------------
            // Find member Auth using parentId
            // ------------------------------------

            const memberAuth = await AuthModel.findOne({
                parentId: parentObjectId,
            });

            if (!memberAuth) {
                return {
                    status: 404,
                    success: false,
                    message: "User not found",
                };
            }

            // ------------------------------------
            // Update member Auth
            // ------------------------------------

            const updatedAuth = await AuthModel.findOneAndUpdate(
                {
                    _id: memberAuth._id,
                    parentId: parentObjectId,
                },
                {
                    $set: {
                        user_group,
                    },
                },
                {
                    returnDocument: "after",
                    runValidators: true,
                }
            );

            if (!updatedAuth) {
                return {
                    status: 404,
                    success: false,
                    message: "Auth user not found",
                };
            }

            // ------------------------------------
            // Update member UserDocument
            // ------------------------------------

            const updatedUser = await UserModel.findOneAndUpdate(
                {
                    authId: memberAuth._id,
                },
                {
                    $set: {
                        full_name,
                        role,
                    },
                },
                {
                    returnDocument: "after",
                    runValidators: true,
                }
            );

            if (!updatedUser) {
                return {
                    status: 404,
                    success: false,
                    message: "User document not found",
                };
            }

            // ------------------------------------
            // Success
            // ------------------------------------

            return {
                status: 200,
                success: true,
                message: "User updated successfully",
            };

        } catch (error) {
            console.error("Update member error:", error);

            return {
                status: 500,
                success: false,
                message: "Failed to update member",
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

    async getUsers(parentId, query) {
        try {
            if (!mongoose.Types.ObjectId.isValid(parentId)) {
                return {
                    status: 400,
                    success: false,
                    message: "Invalid parent ID",
                };
            }

            const { page = 1, limit = 10 } = query;

            const parentObjectId = new mongoose.Types.ObjectId(parentId);
            const skip = (page - 1) * limit;
            // 1. Find all auth records having this parentId
            const authUsers = await AuthModel
                .find({ parentId: parentObjectId })
                .select("_id")
                .lean();

            const authIds = authUsers.map((auth) => auth._id);
            // 2. Get total count
            const totalRecords = await UserModel.countDocuments({
                authId: { $in: authIds },
            });

            const users = await UserModel
                .find({
                    authId: { $in: authIds }
                })
                .populate("authId")
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean();

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
                data: {
                    users,
                    pagination: {
                        currentPage: page,
                        limit,
                        totalRecords,
                        totalPages: Math.ceil(totalRecords / limit),
                        hasNextPage: page < Math.ceil(totalRecords / limit),
                        hasPreviousPage: page > 1,
                    },
                },
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