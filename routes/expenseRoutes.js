import express from 'express'
import { addExpense, getAllExpense, downloadExpenseExcel, deleteExpense } from '../controllers/expenseController.js'
import { auth } from '../middle_ware/auth.js'


const router = express.Router();

router.post("/add", auth, addExpense)
router.get("/get", auth, getAllExpense)
router.get("/downloadexcel", auth, downloadExpenseExcel)
router.get("/:id", auth, deleteExpense)

export default router;
