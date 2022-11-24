import express from 'express';
import {
  getAllUsers,
  addUser,
  searchUser,
  login,
  getStudent,
} from '../controllers/userController';
const router = express.Router();

// get all users
router.get('/', getAllUsers);
router.post('/login', login);

// add any user by passing their details and role
router.post('/', addUser);

// retrieve a user by either uuid or id
router.get('/search', searchUser);
router.get('/:studentUUID', getStudent);

export default router;
