import { Request, Response } from 'express';
import { addIngredient, fetchIngredients, editIngredient, removeIngredient } from '../services/ingredientsService';

const createIngredient = async (req: Request, res: Response) => {
  const { name, price, quantity, store } = req.body;
  const user_id = (req as any).user.id;
  try {
    const ingredient = await addIngredient(name, price, quantity, store, user_id);
    res.json(ingredient);
  } catch (err) {
    console.error('Failed to add ingredient:', err);
    res.status(500).send('Server Error');
  }
};

const getIngredients = async (req: Request, res: Response) => {
  const user_id = (req as any).user.id;
  try {
    const ingredients = await fetchIngredients(user_id);
    res.json(ingredients);
  } catch (err) {
    console.error('Failed to fetch ingredients:', err);
    res.status(500).send('Server Error');
  }
};

const updateIngredient = async (req: Request, res: Response) => {
  const { name, price, quantity, store } = req.body;
  const { id } = req.params;
  try {
    const ingredient = await editIngredient(Number(id), name, price, quantity, store);
    res.json(ingredient);
  } catch (err) {
    console.error('Failed to edit ingredient:', err);
    res.status(500).send('Server Error');
  }
};

const deleteIngredient = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await removeIngredient(Number(id));
    res.sendStatus(204);
  } catch (err) {
    console.error('Failed to delete ingredient:', err);
    res.status(500).send('Server Error');
  }
};

export { createIngredient, getIngredients, updateIngredient, deleteIngredient };
