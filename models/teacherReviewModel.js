import mongoose from 'mongoose';

const TeacherReviewModel = new mongoose.Schema({
  uuid: { type: String, unique: true },
  authorUUID: {
    type: String,
  },
  teacherUUID: {
    type: String,
  },
  rating: {
    type: String,
    required: true,
  },
  review: {
    type: String,
  },
  recommendation: {
    type: String,
    required: true,
  },
});

const TeacherReview = mongoose.model('TeacherReview', TeacherReviewModel);

export default TeacherReview;
