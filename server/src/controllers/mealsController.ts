import { Request, Response } from 'express';
import { createMeal, getMeals, editMeal, removeMeal } from '../services/mealsService';

const createMealController = async (req: Request, res: Response) => {
  const { name, category, price } = req.body;
  const user_id = (req as any).user.id;
  try {
    const meal = await createMeal(name, category, price, user_id);
    res.json(meal);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

const getMealsController = async (req: Request, res: Response) => {
  const user_id = (req as any).user.id;
  try {
    const meals = await getMeals(user_id);
    res.json(meals);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

const updateMealController = async (req: Request, res: Response) => {
  const { name, category, price } = req.body;
  const { id } = req.params;
  try {
    const meal = await editMeal(Number(id), name, category, price);
    res.json(meal);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

const deleteMealController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await removeMeal(Number(id));
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

export { createMealController, getMealsController, updateMealController, deleteMealController };
