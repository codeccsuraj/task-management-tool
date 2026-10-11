import mongoose from "mongoose";
import { Schema } from "mongoose";

const eventTypeEnum = [
    "ticket_created",
    "status_changed",
    "assignee_changed",
    "priority_changed",
    "title_changed",
    "description_changed",
    "due_date_changed",
    "sprint_changed",
    "label_changed",
    "comment_added",
    "attachment_added",
    "ticket_completed",
    "ticket_reopened",
    "ticket_deleted",
    "ticket_updated",
]
const ticketHistorySchema = new mongoose.Schema({
    ticket: { type: Schema.Types.ObjectId, ref: "Ticket", required: true, index: true, },
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true, },
    actor: { type: Schema.Types.ObjectId, ref: "Auth", required: true, },
    eventType: { type: String, enum: eventTypeEnum, required: true },
    field: { type: String, default: null, },
    oldValue: { type: Schema.Types.Mixed, default: null, },
    newValue: { type: Schema.Types.Mixed, default: null, },
    message: { type: String, required: true, trim: true, maxlength: 500, },
    metadata: { type: Schema.Types.Mixed, default: () => ({}), },
}, { versionKey: false, timestamps: true })

ticketHistorySchema.index({ ticket: 1, createdAt: -1, });

// Project activity feed
ticketHistorySchema.index({ project: 1, createdAt: -1, });

// User activity history
ticketHistorySchema.index({ actor: 1, createdAt: -1, });

const TicketHistoryModal = mongoose.model("TicketHistory", ticketHistorySchema);
export default TicketHistoryModal;