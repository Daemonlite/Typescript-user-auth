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
import { authenticateJWT } from '../middleware/verify';

router.get('/user',authenticateJWT, getUsers);
router.get('/users/:id', getUserById);
router.post('/register', register);
router.post('/login', loginUser);
router.put('/users/:id',authenticateJWT, updateUserInfo);
router.delete('/users/:id',authenticateJWT, deleteUser);

export default router;
