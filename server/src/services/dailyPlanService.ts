// server/src/services/dailyPlansService.ts

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const createNewDailyPlan = async (userId: number, date: string) => {
  const result = await pool.query(
    'INSERT INTO daily_plans (user_id, date) VALUES ($1, $2) RETURNING *',
    [userId, date]
  );
  return result.rows[0];
};

export const getAllDailyPlans = async (userId: number) => {
  const result = await pool.query(
    'SELECT * FROM daily_plans WHERE user_id = $1',
    [userId]
  );
  return result.rows;
};

export const addMeal = async (dailyPlanId: number, mealId: number) => {
  const result = await pool.query(
    'INSERT INTO daily_plan_meals (daily_plan_id, meal_id) VALUES ($1, $2) RETURNING *',
    [dailyPlanId, mealId]
  );
  return result.rows[0];
};

export const addIngredient = async (dailyPlanId: number, ingredientId: number) => {
  const result = await pool.query(
    'INSERT INTO daily_plan_ingredients (daily_plan_id, ingredient_id) VALUES ($1, $2) RETURNING *',
    [dailyPlanId, ingredientId]
  );
  return result.rows[0];
};
