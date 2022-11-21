import express from 'express'
import {GetAllUsers} from '../controllers/userController'
const router = express.Router();


router.get('/',GetAllUsers)

module.exports = router;