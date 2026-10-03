import mongoose from "mongoose";
import ProjectModal from "../../model/ticket/Project.js";
import ProjectMemberModal from "../../model/ticket/ProjectMember.js";

class TicketServices {
    async generateProjectKey(name) {
        const words = name
            .trim()
            .toUpperCase()
            .replace(/[^A-Z0-9\s]/g, "")
            .split(/\s+/)
            .filter(Boolean);

        if (!words.length) {
            throw new Error("Invalid project name");
        }

        let baseKey;

        if (words.length > 1) {
            baseKey = words
                .map(word => word[0])
                .join("");
        } else {
            baseKey = words[0].substring(0, 3);
        }

        baseKey = baseKey.substring(0, 6);

        let key = baseKey;
        let counter = 1;

        while (await ProjectModal.exists({ key })) {
            const suffix = String(counter);

            key = `${baseKey.substring(0, 6 - suffix.length)}${suffix}`;

            counter++;
        }
        return key;
    }

    async createProject(data, authId) {
        try {
            if (!authId || !mongoose.Types.ObjectId.isValid(authId)) {
                return {
                    status: 400,
                    success: false,
                    message: "Invalid auth Id",
                };
            }

            if (!data?.name || data.name.trim() === "") {
                return {
                    status: 400,
                    success: false,
                    message: "Project name is required",
                };
            }

            // Remove duplicate members
            const memberIds = Array.isArray(data?.members)
                ? [...new Set(data.members.map(String))]
                : [];

            // Don't send members to Project collection
            const { members, ...projectData } = data;

            // Generate project key
            const projectKey = await this.generateProjectKey(data.name);

            const finalPayload = {
                ...projectData,
                name: data.name.trim(),
                key: projectKey,
                owner: authId,
            };

            // Create project
            const project = await ProjectModal.create(finalPayload);

            // Create project members
            const projectMembers = [
                // Project owner
                {
                    project: project._id,
                    user: authId,
                    role: "admin",
                    status: "active",
                    invitedBy: authId,
                    joinedAt: new Date(),
                },

                // Selected members
                ...memberIds
                    .filter((userId) => userId !== String(authId))
                    .map((userId) => ({
                        project: project._id,
                        user: userId,
                        role: "member",
                        status: "invited",
                        invitedBy: authId,
                    })),
            ];

            if (projectMembers.length > 0) {
                await ProjectMemberModal.insertMany(projectMembers);
            }

            return {
                status: 201,
                success: true,
                message: "Project added successfully",
                data: {
                    project,
                    members: projectMembers,
                },
            };

        } catch (error) {
            console.error("Create Project Error:", error);

            // Duplicate project key
            if (error?.code === 11000) {
                return {
                    status: 409,
                    success: false,
                    message: "Project key already exists",
                };
            }

            return {
                status: 500,
                success: false,
                message: "Something went wrong while adding project",
                error: error?.message,
            };
        }
    }

    async getMyProjects(authId, { page = 1, limit = 10 }) {
        try {
            if (!authId || !mongoose.Types.ObjectId.isValid(authId)) {
                return {
                    status: 400,
                    success: false,
                    message: "Invalid auth Id",
                };
            }

            page = Math.max(Number(page) || 1, 1);
            limit = Math.max(Number(limit) || 10, 1);
            const skip = (page - 1) * limit;

            const filter = {
                owner: new mongoose.Types.ObjectId(authId),
                isArchived: false,
            };

            const [projects, totalRecords] = await Promise.all([
                ProjectModal.find(filter)
                    .populate({
                        path: "owner",
                        select: "email",
                    })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),

                ProjectModal.countDocuments(filter),
            ]);

            const totalPages = Math.ceil(totalRecords / limit);

            return {
                status: 200,
                success: true,
                message: "Projects fetched successfully",
                data: {
                    pagination: {
                        currentPage: page,
                        limit,
                        totalRecords,
                        totalPages,
                        hasNextPage: page < totalPages,
                        hasPreviousPage: page > 1,
                    },
                    projects,
                },
            };
        } catch (error) {
            console.error("Get My Projects Error:", error);

            return {
                status: 500,
                success: false,
                message: "Something went wrong while fetching projects",
                error: error?.message,
            };
        }
    }
};

export const ticketService = new TicketServices();