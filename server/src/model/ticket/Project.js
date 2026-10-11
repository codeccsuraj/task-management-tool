import mongoose, { Schema } from 'mongoose'

const projectDocumentSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    key: { type: String, required: true, unique: true, uppercase: true, trim: true, maxlength: 6 },
    description: { type: String, trim: true },
    owner: { type: Schema.Types.ObjectId, ref: 'Auth', required: true },
    ticketSequence: { type: Number, default: 0, min: 0, },
    isArchived: { type: Boolean, default: false },
}, { timestamps: true });

const ProjectModal = mongoose.model('Project', projectDocumentSchema)

export default ProjectModal;