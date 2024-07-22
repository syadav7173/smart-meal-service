import express from 'express';
import auth from '../middleware/auth';
import { createMealController, getMealsController, updateMealController, deleteMealController } from '../controllers/mealsController';

const router = express.Router();

router.post('/', auth, createMealController);
router.get('/', auth, getMealsController);
router.put('/:id', auth, updateMealController);
router.delete('/:id', auth, deleteMealController);

export default router;
