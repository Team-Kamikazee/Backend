import express from 'express';
import {
  addExpenditure,
  getAllExpenditures,
} from '../controllers/expenditureController';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post('/', upload.single('photo'), addExpenditure);
router.get('/', getAllExpenditures);

export default router;
