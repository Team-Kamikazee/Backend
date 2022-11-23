import userRouter from './userRouter';
import classRouter from './resultsRouter';
import reviewRouter from './reviewRouter';
import express from 'express';

const router = express.Router();

router.use('/users', userRouter);
router.use('/results', classRouter);
router.use('/review', reviewRouter);

router.use((req, res, next) => {
  next({
    status: 404,
    message: 'Not Found',
  });
});

export default router;
