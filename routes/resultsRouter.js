import express from 'express';
import {
  getAllStudentResults,
  getClassYearResults,
  getTermResults,
  addStudentResults,
} from '../controllers/classController';
const router = express.Router();

// get all student results
router.get('/all/:studentUUID', getAllStudentResults);

// get student results per year
router.get('/school-year/:studentUUID/:schoolYear', getClassYearResults);
router.get('/school-year/:studentUUID/:schoolYear/:term', getTermResults);

// get student results per term
router.get('/classTerm/:studentUUID', getTermResults);

/* 
  TEACHER ROUTES
*/
// Add student results
router.post('/:studentUUID', addStudentResults);

export default router;
