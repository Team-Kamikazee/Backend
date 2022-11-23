import express from 'express';
import { getTeacherReview, addReview } from '../controllers/reviewController';
const router = express.Router();

// Write a review
router.post('/', addReview);

// Get all reviews for a target
router.get('/:teacherUUID', getTeacherReview);

// Get all reviews for a target by topic
export default router;
