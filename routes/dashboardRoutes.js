import express from 'express'
import { getDashboardData } from '../controllers/dashboardControler.js'
import { auth } from '../middle_ware/auth.js'


const router = express.Router();

router.get("/get", auth, getDashboardData)

export default router;