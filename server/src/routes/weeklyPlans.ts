import express from 'express';
import { getWeeklyPlanByDate } from '../controllers/weeklyPlansController';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/', auth, getWeeklyPlanByDate);

export default router;