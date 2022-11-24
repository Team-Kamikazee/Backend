import express from 'express';
import {
  addExpenditure,
//   getExpenditure,
} from '../controllers/expenditureController';
const router = express.Router();

router.post('/', addExpenditure);
// router.get('/', getExpenditure);

export default router;
