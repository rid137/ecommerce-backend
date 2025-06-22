import Transaction from "../models/transaction.model";
import mongoose from "mongoose";
import { BadRequest, NotFound } from "../errors/httpErrors";

interface TransactionFilter {
  page?: number;
  size?: number;
  transactionId?: string;
  status?: string;
  from?: string;
  to?: string;
}

class TransactionService {
    async deleteTransaction(id: string) {
        const transaction = await Transaction.findByIdAndDelete(id);
        if (!transaction) throw NotFound("Transaction not found");
        return transaction;
    }

    async getTransaction(id: string) {
        const transaction = await Transaction.findById(id)
        .populate("user", "username email");
        if (!transaction) throw NotFound("Transaction not found");
        return transaction;
    }

    async getAllTransactions(query: TransactionFilter) {
        const {
            page = 1,
            size = 10,
            transactionId,
            status,
            from,
            to
        } = query;

        const filter: Record<string, any> = {};
        if (transactionId) {
        if (!mongoose.Types.ObjectId.isValid(transactionId)) {
            throw BadRequest("Invalid transaction ID format");
        }
        filter._id = new mongoose.Types.ObjectId(transactionId);
        }

        if (status?.trim()) {
        filter.status = { $regex: status.trim(), $options: "i" };
        }

        if (from && to) {
        const startDate = new Date(from);
        const endDate = new Date(to);
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw BadRequest("Invalid date format");
        }
        filter.createdAt = { $gte: startDate, $lte: endDate };
        }

        const [totalDocuments, transactions] = await Promise.all([
        Transaction.countDocuments(filter),
        Transaction.find(filter)
            .populate("user", "username email")
            .limit(size)
            .skip((page - 1) * size)
            .sort({ createdAt: -1 })
        ]);
        const perPage = size 
        const currentPage = page;
        
        return {
            transactions,
            pagination: {
                currentPage,
                perPage,
                totalDocuments,
                totalPages: Math.ceil(totalDocuments / perPage),
            },
        };
    }

    async getUserTransactions(userId: string) {
        return Transaction.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate("user", "username email");
    }
}

export default new TransactionService();