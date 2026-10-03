import mongoose, { Schema } from "mongoose";

const projectMemberDocumentSchema = new mongoose.Schema(
    {
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: "Auth",
            required: true,
        },

        role: {
            type: String,
            enum: ["admin", "lead", "member"],
            default: "member",
        },

        status: {
            type: String,
            enum: ["active", "invited", "removed"],
            default: "invited",
        },

        invitedBy: {
            type: Schema.Types.ObjectId,
            ref: "Auth",
        },

        joinedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent same user from being added twice to the same project
projectMemberDocumentSchema.index(
    { project: 1, user: 1 },
    { unique: true }
);

const ProjectMemberModal = mongoose.model(
    "ProjectMember",
    projectMemberDocumentSchema
);

export default ProjectMemberModal;