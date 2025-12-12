import IncomeModels from "../models/Income.js";
import ExpenseModels from "../models/Expense.js";
import { isValidObjectId, Types } from "mongoose";

const getDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;
        const userObjId = new Types.ObjectId(String(userId));

        // 🔹 Total Income & Expense
        const totalIncomeAgg = await IncomeModels.aggregate([
            { $match: { userId: userObjId } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        const totalExpenseAgg = await ExpenseModels.aggregate([
            { $match: { userId: userObjId } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        const totalIncome = totalIncomeAgg[0]?.total || 0;
        const totalExpense = totalExpenseAgg[0]?.total || 0;
        const totalBalance = totalIncome - totalExpense;

        // 🔹 Fetch All Incomes & Expenses
        const incomes = await IncomeModels.find({ userId }).sort({ date: -1 });
        const expenses = await ExpenseModels.find({ userId }).sort({ date: -1 });

        // 🔹 Combine into recent transactions list
        const recentTransactions = [
            ...incomes.map((txn) => ({
                ...txn.toObject(),
                type: "income",
            })),
            ...expenses.map((txn) => ({
                ...txn.toObject(),
                type: "expense",
            })),
        ]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        // 🔹 Return unified structure
        res.json({
            status: true,
            totalBalance,
            totalIncome,
            totalExpense,
            incomes,
            expenses,
            recentTransactions,
        });
    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({
            status: false,
            message: error.message || "Server error",
        });
    }
};

export { getDashboardData };
