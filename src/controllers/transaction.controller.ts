import asyncHandler from "../middlewares/asyncHandler";
import TransactionService from "../services/transaction.service";
import { successResponse, paginatedResponse } from "../utils/apiResponse";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../utils/authTypes";

class TransactionController {
  async removeTransaction(req: Request, res: Response) {
    const { id } = req.params;
    const transaction = await TransactionService.deleteTransaction(id);
    successResponse(res, transaction, "Transaction removed successfully");
  }

  async readTransaction(req: Request, res: Response) {
    const { id } = req.params;
    const transaction = await TransactionService.getTransaction(id);
    successResponse(res, transaction, "Transaction retrieved successfully");
  }

  async listTransactions(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const size = parseInt(req.query.size as string) || 10;

    const { transactions, pagination } = await TransactionService.getAllTransactions({
      ...req.query,
      page,
      size,
    });
    paginatedResponse(res, transactions, pagination, "Transactions retrieved successfully");
  }

  async getUserTransactions(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?._id
    const transactions = await TransactionService.getUserTransactions(userId!);
    successResponse(res, transactions, "User transactions retrieved successfully");
  }
}

export default new TransactionController();