import mongoose, { Schema } from "mongoose";

const sprintDocumentSchema = new mongoose.Schema({
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    name: { type: String, required: true, trim: true },
    goal: { type: String, trim: true },
    status: { type: String, enum: ['planned', 'active', 'completed'], default: 'planned' },
    startDate: { type: Date },
    endDate: { type: Date },
    completedAt: { type: Date },
}, { timestamps: true })

const SprintModal = mongoose.model(
    "Sprint",
    sprintDocumentSchema
);

export default SprintModal;