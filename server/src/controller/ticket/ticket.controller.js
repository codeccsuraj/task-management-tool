import { ticketService } from "../../service/ticket/ticket.service.js";
import { tixketHistoryService } from "../../service/ticket/ticketHistory.service.js";
import { decodeToken } from "../../utils/jwt.js";
import path from "path";
import fs from "fs";
import { replacePendingImages } from "../../middleware/upload.middleware.js";
import mongoose from "mongoose";

export const createProject = async (req, res) => {
    try {
        const data = req.body;
        const token = req.cookies.accessToken;
        const user = decodeToken(token);

        const result = await ticketService.createProject(data, user?.id);

        return res.status(result.status).json(result);
    } catch (error) {
        console.error("UserController createProject error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while adding data",
        });
    }
}

export const getMyProjects = async (req, res) => {
    try {
        const query = req.query;
        const token = req.cookies.accessToken;
        const user = decodeToken(token);

        const result = await ticketService.getMyProjects(user?.id, query);

        return res.status(result.status).json(result);
    } catch (error) {
        console.error("UserController getMyProjects error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching data",
        });
    }
}

export const updateMemberProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const data = req.body;
        const token = req.cookies.accessToken;
        const user = decodeToken(token);

        const result = await ticketService.updateMemberProject(projectId, user?.id, data);

        return res.status(result.status).json(result);
    } catch (error) {
        console.error("UserController getMyProjects error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching data",
        });
    }
}

export const getMemberProjects = async (req, res) => {
    try {
        const token = req.cookies.accessToken;
        const user = decodeToken(token);

        const result = await ticketService.getMemberProjects(user?.id);

        return res.status(result.status).json(result);
    } catch (error) {
        console.error("UserController getMyProjects error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching data",
        });
    }
}

export const createTicket = async (req, res) => {
    try {
        const token = req.cookies.accessToken;
        const user = decodeToken(token);
        const data = req.body;

        const result = await ticketService.createTicket(data, user?.id);

        return res.status(result.status).json(result);
    } catch (error) {
        console.error("UserController createTicket error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating data",
        });
    }
}

export const createSprint = async (req, res) => {
    try {
        const data = req.body;
        const result = await ticketService.createSprint(data);

        return res.status(result.status).json(result)
    } catch (error) {
        console.error("Create Sprint Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong while creating sprint",
        })
    }
}

export const getSprintByProjectId = async (req, res) => {
    try {
        const { projectKey } = req.params;
        const result = await ticketService.getSprintByProjectId(projectKey);

        return res.status(result.status).json(result)
    } catch (error) {
        console.error("Create Sprint Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong while creating sprint",
        })
    }
}

export const getProjectTeam = async (req, res) => {
    try {
        const { projectId } = req.params;
        const result = await ticketService.getProjectTeam(projectId);

        return res.status(result.status).json(result)
    } catch (error) {
        console.error("Create Sprint Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong while creating sprint",
        })
    }
}

export const getTicketByProjectId = async (req, res) => {
    try {
        const query = req.query;
        const result = await ticketService.getTicketByProjectId(query);

        return res.status(result.status).json(result)
    } catch (error) {
        console.error("Create Sprint Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong while creating sprint",
        })
    }
}

export const getTicketById = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const result = await ticketService.getTicketById(ticketId);

        return res.status(result.status).json(result)
    } catch (error) {
        console.error("Create Sprint Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong while creating sprint",
        })
    }
}

export const getHistoryByTicketId = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const result = await tixketHistoryService.getHistoryByTicketId(ticketId);

        return res.status(result.status).json(result)
    } catch (error) {
        console.error("Create Sprint Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong while creating sprint",
        })
    }
}

export const updateTicketFields = async (req, res) => {
    let uploadedFiles = [];

    try {
        const { ticketId, event } = req.query;

        // 1. Validate request
        if (!mongoose.Types.ObjectId.isValid(ticketId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ticket ID",
            });
        }

        if (!event) {
            return res.status(400).json({
                success: false,
                message: "Update event is required",
            });
        }

        // 2. Authenticate user
        const token = req.cookies?.accessToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const user = decodeToken(token);

        if (!user?.id) {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token",
            });
        }

        // 3. Prepare update data
        const data = { ...req.body };

        uploadedFiles = req.files || [];

        // 4. Normalize attachment IDs
        const attachmentIds = data.attachmentIds
            ? Array.isArray(data.attachmentIds)
                ? data.attachmentIds
                : [data.attachmentIds]
            : [];

        delete data.attachmentIds;

        // 5. Validate attachment mapping
        if (attachmentIds.length !== uploadedFiles.length) {
            return res.status(400).json({
                success: false,
                message: "Uploaded files and attachment IDs do not match",
            });
        }

        // 6. Prepare uploaded image metadata
        const uploadedImages = uploadedFiles.map((file, index) => {
            const relativePath = path
                .relative(
                    path.join(process.cwd(), "uploads"),
                    file.path
                )
                .split(path.sep)
                .join("/");

            return {
                pendingId: attachmentIds[index],
                originalName: file.originalname,
                fileName: file.filename,
                mimeType: file.mimetype,
                size: file.size,
                path: relativePath,
                url: `/uploads/${relativePath}`,
            };
        });

        // 7. Replace temporary blob URLs
        if (
            typeof data.description === "string" &&
            uploadedImages.length > 0
        ) {
            data.description = replacePendingImages(
                data.description,
                uploadedImages
            );
        }

        // 8. Update ticket and save attachment metadata
        const result = await ticketService.updateTicketFields(
            ticketId,
            data,
            event,
            user.id,
            uploadedImages
        );

        // 9. Remove uploaded files if update failed
        if (!result?.success) {
            await Promise.all(
                uploadedFiles.map(async (file) => {
                    try {
                        await fs.unlink(file.path);
                    } catch (error) {
                        console.error(
                            "Failed to delete uploaded file:",
                            file.path,
                            error.message
                        );
                    }
                })
            );
        }

        return res.status(result.status || 200).json(result);

    } catch (error) {
        console.error("Update Ticket Error:", error);

        // 10. Cleanup files if an exception occurs
        await Promise.all(
            uploadedFiles.map(async (file) => {
                try {
                    await fs.unlink(file.path);
                } catch (cleanupError) {
                    console.error(
                        "File cleanup error:",
                        cleanupError.message
                    );
                }
            })
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Something went wrong while updating ticket",
        });
    }
};