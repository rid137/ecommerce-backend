import asyncHandler from "../middlewares/asyncHandler";
import TransactionService from "../services/transaction.service";
import { successResponse, paginatedResponse } from "../utils/apiResponse";

class TransactionController {
  removeTransaction = asyncHandler(async (req, res) => {
    const transaction = await TransactionService.deleteTransaction(req.params.id);
    successResponse(res, transaction, "Transaction removed successfully");
  });

  readTransaction = asyncHandler(async (req, res) => {
    const transaction = await TransactionService.getTransaction(req.params.id);
    successResponse(res, transaction, "Transaction retrieved successfully");
  });

  listTransactions = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const size = parseInt(req.query.size as string) || 10;

    const { transactions, pagination } = await TransactionService.getAllTransactions({
      ...req.query,
      page,
      size,
    });
    paginatedResponse(res, transactions, pagination, "Transactions retrieved successfully");
  });

  getUserTransactions = asyncHandler(async (req, res) => {
    const transactions = await TransactionService.getUserTransactions(req.user._id);
    successResponse(res, transactions, "User transactions retrieved successfully");
  });
}

export default new TransactionController();