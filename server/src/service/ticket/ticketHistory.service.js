import mongoose from "mongoose";
import TicketHistoryModal from "../../model/ticket/TicketHistory.js";
import TicketModel from "../../model/ticket/Ticket.js";

class TicketHistoryServices {
    async getHistoryByTicketId(ticketId) {
        try {
            // 1. Validate ticket ID
            if (!ticketId || !mongoose.isValidObjectId(ticketId)) {
                return {
                    status: 400,
                    success: false,
                    message: "Invalid ticket ID",
                };
            }

            // 2. Verify that the ticket exists
            const ticketExists = await TicketModel.exists({
                _id: ticketId,
                isDeleted: false,
            });

            if (!ticketExists) {
                return {
                    status: 404,
                    success: false,
                    message: "Ticket not found",
                };
            }

            // 3. Fetch ticket history, newest first
            const history = await TicketHistoryModal.find({
                ticket: ticketId,
            })
                .sort({ createdAt: -1 })
                .lean();

            // 4. Handle empty history
            if (history.length === 0) {
                return {
                    status: 200,
                    success: true,
                    message: "No ticket history found",
                    data: [],
                };
            }

            // 5. Return history
            return {
                status: 200,
                success: true,
                message: "Ticket history fetched successfully",
                data: history,
            };
        } catch (error) {
            console.error("Error fetching ticket history:", error);

            return {
                status: 500,
                success: false,
                message: "Failed to fetch ticket history",
            };
        }
    }
}

export const tixketHistoryService = new TicketHistoryServices();