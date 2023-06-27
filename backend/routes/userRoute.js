import express from 'express';
import {
  authUser,
  registerUser,
  logOutUser,
  getUserProfile,
  updateUserProfile,
  getUsers
} from "../controllers/userController.js";
const router = express.Router();

router.post('/auth', authUser);
router.post('/', registerUser);
router.post('/logout', logOutUser);
router.get('/getAll', getUsers);
router.route('/profile/:id').get(getUserProfile).put(updateUserProfile);

export default router;