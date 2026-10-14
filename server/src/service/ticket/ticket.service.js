import mongoose from "mongoose";
import ProjectModal from "../../model/ticket/Project.js";
import ProjectMemberModal from "../../model/ticket/ProjectMember.js";
import SprintModal from "../../model/ticket/Sprint.js";
import TicketModel from "../../model/ticket/Ticket.js";
import TicketHistoryModal from "../../model/ticket/TicketHistory.js";
import { populate } from "dotenv";

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

    async getMemberProjects(authId) {
        try {
            // ------------------------------------
            // Validate authId
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

            const projects = await ProjectMemberModal.aggregate([
                // ------------------------------------
                // Get memberships of current user
                // ------------------------------------
                {
                    $match: {
                        user: new mongoose.Types.ObjectId(authId),
                        status: { $in: ["active", "invited"] },
                    },
                },

                // ------------------------------------
                // Get project details
                // ------------------------------------
                {
                    $lookup: {
                        from: "projects",
                        localField: "project",
                        foreignField: "_id",
                        as: "project",
                    },
                },

                {
                    $unwind: "$project",
                },

                // ------------------------------------
                // Don't return archived projects
                // ------------------------------------
                {
                    $match: {
                        "project.isArchived": false,
                    },
                },

                // ------------------------------------
                // Return required fields
                // ------------------------------------
                {
                    $project: {
                        _id: 0,

                        projectId: "$project._id",
                        name: "$project.name",
                        key: "$project.key",
                        description: "$project.description",
                        owner: "$project.owner",
                        isArchived: "$project.isArchived",
                        createdAt: "$project.createdAt",
                        updatedAt: "$project.updatedAt",

                        membership: {
                            role: "$role",
                            status: "$status",
                            invitedBy: "$invitedBy",
                            joinedAt: "$joinedAt",
                        },
                    },
                },

                // ------------------------------------
                // Latest projects first
                // ------------------------------------
                {
                    $sort: {
                        createdAt: -1,
                    },
                },
            ]);

            return {
                status: 200,
                success: true,
                message: "Projects fetched successfully",
                data: projects,
            };
        } catch (error) {
            console.error("Get My Projects Error:", error);

            return {
                status: 500,
                success: false,
                message: "Something went wrong while fetching projects",
            };
        }
    }

    async createSprint(data) {
        try {
            const result = await SprintModal.create(data);

            if (!result) {
                return {
                    status: 400,
                    success: false,
                    message: "Failed to add sprint"
                }
            }

            return {
                status: 201,
                success: true,
                message: "Sprint created successfully",
                data: result,
            };
        } catch (error) {
            console.error("Create Sprint Error:", error);
            return {
                status: 500,
                success: false,
                message: error.message || "Something went wrong while creating sprint",
            };
        }
    }

    async getSprintByProjectId(projectKey) {
        try {
            // Validate project ID
            if (
                !projectKey ||
                typeof projectKey !== 'string' ||
                projectKey.trim() === ""
            ) {
                return {
                    status: 400,
                    success: false,
                    message: 'Please provide a valid project id',
                };
            }

            const getProjectId = await ProjectModal.findOne({ key: projectKey });

            if (!getProjectId) {
                return {
                    status: 200,
                    success: true,
                    message: 'No sprints found for this project',
                };
            }

            // Fetch sprints associated with the project
            const sprints = await SprintModal.find({
                project: getProjectId._id,
            })
                .populate('project', 'name key')
                .sort({ createdAt: -1 })
                .lean();

            // Check if sprints exist
            if (!sprints.length) {
                return {
                    status: 200,
                    success: true,
                    message: 'No sprints found for this project',
                };
            }

            return {
                status: 200,
                success: true,
                message: 'Sprints fetched successfully',
                data: sprints,
            };
        } catch (error) {
            console.error('Get Sprint By Project ID Error:', error);

            return {
                status: 500,
                success: false,
                message: error.message || 'Something went wrong while fetching sprints',
            };
        }
    }

    async getProjectTeam(projectId) {
        try {
            if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
                return {
                    status: 400,
                    success: false,
                    message: 'Invalid project ID',
                };
            }
            const members = await ProjectMemberModal.find({
                project: projectId,
                status: { $in: ['active', 'invited'] },
            }).populate({
                path: 'user',
                select: 'email',
            }).populate({
                path: 'invitedBy',
                select: 'email',
            }).sort({ createdAt: -1 }).lean();

            return {
                status: 200,
                success: true,
                message: 'Project team fetched successfully',
                data: {
                    project,
                    members,
                    total: members.length,
                },
            };
        } catch (error) {
            console.error('Get Team Error:', error);

            return {
                status: 500,
                success: false,
                message: 'Something went wrong while fetching project team',
            };
        }
    }


    async createTicket(data, authUser) {
        try {
            // 1. Validate authenticated user
            if (
                !authUser ||
                typeof authUser !== 'string' ||
                !mongoose.Types.ObjectId.isValid(authUser)
            ) {
                return {
                    status: 401,
                    success: false,
                    message: 'Unauthorized user',
                };
            }

            // 2. Validate project key
            if (
                !data?.project ||
                typeof data.project !== 'string' ||
                !data.project.trim()
            ) {
                return {
                    status: 400,
                    success: false,
                    message: 'Project key is required',
                };
            }

            // 3. Find project using its key (e.g. TMT)
            const existingProject = await ProjectModal.findOne({
                key: data.project.trim().toUpperCase(),
            })
                .select('_id key')
                .lean();

            if (!existingProject) {
                return {
                    status: 404,
                    success: false,
                    message: 'Project not found',
                };
            }

            // 4. Atomically increment ticket sequence
            const project = await ProjectModal.findByIdAndUpdate(
                existingProject._id,
                {
                    $inc: { ticketSequence: 1 },
                },
                {
                    returnDocument: 'after',
                    runValidators: true,
                }
            )
                .select('_id key ticketSequence')
                .lean();

            if (!project) {
                return {
                    status: 404,
                    success: false,
                    message: 'Project not found',
                };
            }

            // 5. Generate readable ticket ID
            const ticketId = `${project.key}-${project.ticketSequence}`;

            // 6. Prepare ticket payload
            const {
                project: _projectKey,
                reporter: _reporter,
                ticketId: _ticketId,
                ...ticketData
            } = data;

            const payload = {
                ...ticketData,
                project: project._id,
                reporter: new mongoose.Types.ObjectId(authUser),
                ticketId,
            };

            // 7. Create ticket
            const createdTicket = await TicketModel.create(payload);

            // 8. Record ticket creation history
            const history = await TicketHistoryModal.create({
                ticket: createdTicket._id,
                project: project._id,
                actor: new mongoose.Types.ObjectId(authUser),
                eventType: 'ticket_created',
                field: null,
                oldValue: null,
                newValue: {
                    ticketId: createdTicket.ticketId,
                    title: createdTicket.title,
                    status: createdTicket.status,
                    priority: createdTicket.priority,
                    type: createdTicket.type,
                },
                message: `Created ticket ${createdTicket.ticketId}: ${createdTicket.title}`,
                metadata: {
                    ticketId: createdTicket.ticketId,
                    source: 'ticket_creation',
                },
            });

            return {
                status: 201,
                success: true,
                message: 'Ticket created successfully',
                data: {
                    ticket: createdTicket,
                    history,
                },
            };
        } catch (error) {
            console.error('Create Ticket Error:', {
                message: error.message,
                name: error.name,
                errors: error.errors,
            });

            return {
                status: error.name === 'ValidationError' ||
                    error.name === 'CastError'
                    ? 400
                    : 500,
                success: false,
                message:
                    error.message ||
                    'Something went wrong while creating ticket',
            };
        }
    }

    async getTicketByProjectId(query) {
        try {
            const {
                projectKey,
                page = 1,
                limit = 10,
                status,
                priority,
                type,
                search,
            } = query;

            // 1. Validate project key
            if (
                !projectKey ||
                typeof projectKey !== 'string' ||
                !projectKey.trim()
            ) {
                return {
                    status: 400,
                    success: false,
                    message: 'Please provide a valid project key',
                };
            }

            // 2. Validate pagination
            const currentPage = Math.max(1, Number.parseInt(page, 10) || 1);
            const pageSize = Math.min(
                100,
                Math.max(1, Number.parseInt(limit, 10) || 10)
            );
            const skip = (currentPage - 1) * pageSize;

            // 3. Find project by key
            const project = await ProjectModal.findOne({
                key: projectKey.trim().toUpperCase(),
            })
                .select('_id key name')
                .lean();

            if (!project) {
                return {
                    status: 404,
                    success: false,
                    message: 'Project not found',
                };
            }

            // 4. Build ticket filters
            const filter = {
                project: project._id,
            };

            if (status) filter.status = status;
            if (priority) filter.priority = priority;
            if (type) filter.type = type;

            // 5. Search by ticket ID or title
            if (typeof search === 'string' && search.trim()) {
                const escapedSearch = search
                    .trim()
                    .slice(0, 100)
                    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

                filter.$or = [
                    {
                        ticketId: {
                            $regex: escapedSearch,
                            $options: 'i',
                        },
                    },
                    {
                        title: {
                            $regex: escapedSearch,
                            $options: 'i',
                        },
                    },
                ];
            }

            // 6. Fetch tickets and total count concurrently
            const [tickets, total] = await Promise.all([
                TicketModel.find(filter)
                    .sort({ createdAt: -1, _id: -1 })
                    .populate({
                        path: "assigned",
                        select: "email",
                        populate: {
                            path: "user",
                            select: "full_name phone profile_picture",
                        },
                    })
                    .populate({
                        path: "reporter",
                        select: "email",
                        populate: {
                            path: "user",
                            select: "full_name phone profile_picture",
                        },
                    })
                    .populate("sprint")
                    .skip(skip)
                    .limit(pageSize)
                    .lean(),

                TicketModel.countDocuments(filter),
            ]);

            // 7. Return response
            return {
                status: 200,
                success: true,
                message: 'Tickets fetched successfully',
                data: {
                    project: {
                        _id: project._id,
                        key: project.key,
                        name: project.name,
                    },
                    tickets,
                    pagination: {
                        page: currentPage,
                        limit: pageSize,
                        total,
                        totalPages: Math.ceil(total / pageSize),
                        hasNextPage: currentPage * pageSize < total,
                        hasPrevPage: currentPage > 1,
                    },
                },
            };
        } catch (error) {
            console.error('Get Tickets By Project Error:', error);

            return {
                status: 500,
                success: false,
                message: 'Something went wrong while fetching project tickets',
            };
        }
    }

    async getTicketById(id) {
        try {

            // 1. Validate project key
            if (
                !id ||
                typeof id !== 'string' ||
                !id.trim()
            ) {
                return {
                    status: 400,
                    success: false,
                    message: 'Please provide a valid ticket id',
                };
            }


            // 6. Fetch tickets and total count concurrently
            const ticket = await TicketModel.findOne({ ticketId: id })
                .sort({ createdAt: -1, _id: -1 })
                .populate({
                    path: "assigned",
                    select: "email",
                    populate: {
                        path: "user",
                        select: "full_name phone profile_picture",
                    },
                })
                .populate({
                    path: "reporter",
                    select: "email",
                    populate: {
                        path: "user",
                        select: "full_name phone profile_picture",
                    },
                })
                .populate("sprint")
                .lean()

            // 7. Return response
            return {
                status: 200,
                success: true,
                message: 'Ticket fetched successfully',
                data: ticket,
            };
        } catch (error) {
            console.error('Get Ticket By Ticket Error:', error);

            return {
                status: 500,
                success: false,
                message: 'Something went wrong while fetching project tickets',
            };
        }
    }
};

export const ticketService = new TicketServices();