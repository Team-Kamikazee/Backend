import express from 'express'
import { addExpenditure, getAllExpenditures } from '../controllers/expenditureController';
import multer from 'multer';
const router = express.Router();
const upload = multer({ dest: 'uploads/' });



router.post('/', upload.single('photo'),addExpenditure)
router.get('/',getAllExpenditures)

export default router