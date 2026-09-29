import mongoose, { Schema } from 'mongoose'

const projectDocumentSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    key: { type: String, required: true, unique: true, uppercase: true, trim: true, maxlength: 6 },
    description: { type: String, trim: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isArchived: { type: Boolean, default: false },
}, { timestamps: true });

projectDocumentSchema.index({ key: 1 }, { unique: true });