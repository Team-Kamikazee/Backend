import uuid from 'uuid4';
import TeacherReview from '../models/teacherReviewModel';

export const addReview = async (req, res, next) => {
  try {
    const { authorUUID, teacherUUID, rating, recommendation } = req.body;

    console.log(req.body);
    const newReview = new TeacherReview({
      uuid: uuid(),
      authorUUID,
      teacherUUID,
      rating,
      recommendation,
    });
    await newReview.save();
    return res.status(201).json({
      message: 'Review created',
      success: true,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

export const getTeacherReview = async (req, res, next) => {
  try {
    const { teacherUUID } = req.params;

    const reviews = await Review.find({
      teacherUUID,
    });

    if (reviews) {
      return res.status(200).json(reviews);
    }

    return res.status(404).json({
      message: 'Review not found',
      success: false,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};
