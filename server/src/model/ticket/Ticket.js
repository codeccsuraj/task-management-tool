import mongoose, { Schema } from 'mongoose'

const ticketDocumentSchema = new mongoose.Schema({
    ticketId: { type: String, unique: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: false },
    sprint: { type: Schema.Types.ObjectId, ref: 'Sprint', default: null },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    type: { type: String, trim: true },
    status: { type: String, trim: true },
    priority: { type: String, trim: true },
    storyPoints: { type: Number, min: 0, default: 0 },
    assignee: { type: Schema.Types.ObjectId, ref: 'Auth', default: null },
    reporter: { type: Schema.Types.ObjectId, ref: 'Auth', required: true },
    dueDate: { type: Date },
    startDate: { type: Date },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true })