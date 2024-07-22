import express from 'express';
import { createIngredient, getIngredients, updateIngredient, deleteIngredient } from '../controllers/ingredientsController';
import auth from '../middleware/auth';

const router = express.Router();

router.post('/', auth, createIngredient);
router.get('/', auth, getIngredients);
router.put('/:id', auth, updateIngredient);
router.delete('/:id', auth, deleteIngredient);

export default router;
