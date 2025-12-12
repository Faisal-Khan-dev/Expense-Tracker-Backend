import express from 'express'
import { addIncome, getAllIncome, downloadIncomeExcel, deleteIncome } from '../controllers/incomeController.js'
import {auth} from '../middle_ware/auth.js'


const router = express.Router();

router.post("/add", auth, addIncome)
router.get("/get", auth, getAllIncome)
router.get("/downloadexcel", auth, downloadIncomeExcel)
router.get("/:id", auth, deleteIncome)

export default router;
