import express from 'express'
import { addExpenditure } from '../controllers/expenditureController';
const router = express.Router();


router.post('/',addExpenditure)

export default router