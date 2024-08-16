import { Pool } from 'pg';
import { DailyPlan } from '../types'

const pool = new Pool();

export const getDailyPlansByUserId = async (userId: number): Promise<DailyPlan[]> => {
    const { rows } = await pool.query('SELECT * FROM daily_plans WHERE user_id = $1', [userId]);
    return rows;
};

export const addDailyPlan = async (date: string, userId: number): Promise<DailyPlan> => {
    const { rows } = await pool.query(
        'INSERT INTO daily_plans (date, user_id) VALUES ($1, $2) RETURNING *',
        [date, userId]
    );
    return rows[0];
};

export const addMealToDailyPlan = async (dailyPlanId: number, mealId: number): Promise<void> => {
    await pool.query(
        'INSERT INTO daily_plan_meals (daily_plan_id, meal_id) VALUES ($1, $2)',
        [dailyPlanId, mealId]
    );
};
