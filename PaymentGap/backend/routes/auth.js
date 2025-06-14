import express from 'express';
import { login, register, deleteUser, resetPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);

//route for deleting a user
//http://localhost:3000/auth/users/4
router.delete('/users/:id_user', deleteUser);

//http://localhost:3000/auth/reset-password
router.post('/reset-password', resetPassword);


export default router;
