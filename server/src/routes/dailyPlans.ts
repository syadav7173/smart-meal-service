import express from 'express';
import auth from '../middleware/auth';
import { createDailyPlan, getDailyPlans, addMealToDailyPlan, addIngredientToDailyPlan } from '../controllers/dailyPlanController';

const router = express.Router();

// Create a new daily plan
router.post('/', auth, createDailyPlan);

// Get all daily plans
router.get('/', auth, getDailyPlans);

// Add a meal to a daily plan
router.post('/meal', auth, addMealToDailyPlan);

// Add an ingredient to a daily plan
router.post('/ingredient', auth, addIngredientToDailyPlan);

export default router;
