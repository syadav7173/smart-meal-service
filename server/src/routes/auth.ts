import express from 'express';
import { register, login } from '../controllers/authController';

const router = express.Router();

// Register a new user - No auth middleware here
router.post('/register', register);

// Authenticate user and get token - No auth middleware here
router.post('/login', login);

export default router;
