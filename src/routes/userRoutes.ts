import express from 'express';
import {
  getUsers,
  register,
  loginUser,
  deleteUser,
  updateUserInfo,
  getUserById,
} from '../handlers/userHandler';

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/register', register);
router.post('/login', loginUser);
router.put('/users/:id', updateUserInfo);
router.delete('/users/:id', deleteUser);

export default router;
