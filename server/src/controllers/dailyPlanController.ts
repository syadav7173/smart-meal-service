import { Request, Response } from 'express';
import { Pool } from 'pg';
import { DailyPlan, WeeklyPlan } from '../types';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const getWeeklyPlan = async (date: string, userId: number): Promise<WeeklyPlan> => {
  const inputDate = new Date(date);
  inputDate.setUTCHours(0, 0, 0, 0);
  const startOfWeek = new Date(inputDate);
  startOfWeek.setUTCDate(inputDate.getUTCDate() - inputDate.getUTCDay()); // Start of the week (Sunday)
  startOfWeek.setUTCHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6); // End of the week (Saturday)
  endOfWeek.setUTCHours(23, 59, 59, 999);

  console.log(`Fetching existing weekly plan for user: ${userId} from ${startOfWeek.toISOString()} to ${endOfWeek.toISOString()}`);

  const res = await pool.query(
    'SELECT * FROM weeklyPlans WHERE user_id = $1 AND start_date = $2',
    [userId, startOfWeek.toISOString().split('T')[0]]
  );

  if (res.rows.length > 0) {
    console.log('Existing weekly plan found:', res.rows[0]);
    return res.rows[0];
  } else {
    console.log('No existing weekly plan found for the given date range.');
    throw new Error(`No weekly plan found for the given date range: ${startOfWeek.toISOString().split('T')[0]} to ${endOfWeek.toISOString().split('T')[0]}`);
  }
};

const createDailyPlan = async (req: Request, res: Response) => {
  const { date, user_id } = req.body;
  try {
    console.log(`Creating daily plan for date: ${date} and user_id: ${user_id}`);
    const weeklyPlan = await getWeeklyPlan(date, user_id);
    console.log(`Associated weekly plan: ${JSON.stringify(weeklyPlan)}`);

    // Calculate the date of the daily plan based on the weekly plan's start date
    const inputDate = new Date(date);
    const dayOfWeek = inputDate.getUTCDay();
    console.log(`Day of week: ${dayOfWeek} for input date: ${inputDate}`);

    const dailyPlanDate = new Date(weeklyPlan.start_date);
    dailyPlanDate.setUTCDate(dailyPlanDate.getUTCDate() + dayOfWeek);
    const formattedDate = dailyPlanDate.toISOString().split('T')[0];

    console.log(`Calculated daily plan date: ${formattedDate} for day of week: ${dayOfWeek}`);

    // Check if a daily plan already exists for the given date and weekly plan ID
    const existingDailyPlan = await pool.query(
      'SELECT * FROM dailyPlans WHERE date = $1 AND user_id = $2 AND weekly_plan_id = $3',
      [formattedDate, user_id, weeklyPlan.id]
    );

    console.log(`Check existing daily plan query returned: ${existingDailyPlan.rows.length} rows`);

    if (existingDailyPlan.rows.length > 0) {
      console.log('Daily plan already exists:', existingDailyPlan.rows[0]);
      res.json(existingDailyPlan.rows[0]);
      return;
    }

    const result = await pool.query(
      'INSERT INTO dailyPlans (date, user_id, weekly_plan_id) VALUES ($1, $2, $3) RETURNING *',
      [formattedDate, user_id, weeklyPlan.id]
    );

    console.log(`Created daily plan: ${JSON.stringify(result.rows[0])}`);
    res.json(result.rows[0]);
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error creating daily plan:', err.message);
      res.status(500).send({ error: err.message });
    } else {
      console.error('Unexpected error:', err);
      res.status(500).send({ error: 'Unexpected error' });
    }
  }
};

const getDailyPlans = async (req: Request, res: Response) => {
  const { weeklyPlanId } = req.query;
  try {
    if (!weeklyPlanId) {
      throw new Error('Missing weeklyPlanId');
    }

    console.log(`Fetching daily plans for weeklyPlanId: ${weeklyPlanId}`);
    const result = await pool.query(
      `SELECT dp.*, json_agg(m.*) AS meals
      FROM dailyPlans dp
      LEFT JOIN dailyPlansMeals dpm ON dp.id = dpm.dailyPlan_id
      LEFT JOIN meals m ON dpm.meal_id = m.id
      WHERE dp.weekly_plan_id = $1
      GROUP BY dp.id`,
      [weeklyPlanId]
    );

    console.log(`Fetched daily plans: ${JSON.stringify(result.rows)}`);
    res.json(result.rows);
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error fetching daily plans:', err.message);
      res.status(500).send({ error: err.message });
    } else {
      console.error('Unexpected error:', err);
      res.status(500).send({ error: 'Unexpected error' });
    }
  }
};

const addMealToDailyPlan = async (req: Request, res: Response) => {
  const { dailyPlanId, mealId } = req.body;
  try {
    console.log(`Adding meal with id: ${mealId} to daily plan id: ${dailyPlanId}`);
    const result = await pool.query(
      'INSERT INTO dailyPlansMeals (dailyPlan_id, meal_id) VALUES ($1, $2) RETURNING *',
      [dailyPlanId, mealId]
    );
    console.log(`Added meal to daily plan: ${JSON.stringify(result.rows[0])}`);
    res.json(result.rows[0]);

    // Fetching the meals to verify they were added correctly
    const verifyMeals = await pool.query(
      'SELECT * FROM dailyPlansMeals WHERE dailyPlan_id = $1',
      [dailyPlanId]
    );
    console.log(`Meals for dailyPlanId ${dailyPlanId} after addition: ${JSON.stringify(verifyMeals.rows)}`);

  } catch (err) {
    if (err instanceof Error) {
      console.error('Error adding meal to daily plan:', err.message);
      res.status(500).send({ error: err.message });
    } else {
      console.error('Unexpected error:', err);
      res.status(500).send({ error: 'Unexpected error' });
    }
  }
};

const addIngredientToDailyPlan = async (req: Request, res: Response) => {
  const { dailyPlanId, ingredientId } = req.body;
  try {
    console.log(`Adding ingredient with id: ${ingredientId} to daily plan id: ${dailyPlanId}`);
    const result = await pool.query(
      'INSERT INTO dailyPlansIngredients (dailyPlan_id, ingredient_id) VALUES ($1, $2) RETURNING *',
      [dailyPlanId, ingredientId]
    );
    console.log(`Added ingredient to daily plan: ${JSON.stringify(result.rows[0])}`);
    res.json(result.rows[0]);

    // Fetching the ingredients to verify they were added correctly
    const verifyIngredients = await pool.query(
      'SELECT * FROM dailyPlansIngredients WHERE dailyPlan_id = $1',
      [dailyPlanId]
    );
    console.log(`Ingredients for dailyPlanId ${dailyPlanId} after addition: ${JSON.stringify(verifyIngredients.rows)}`);

  } catch (err) {
    if (err instanceof Error) {
      console.error('Error adding ingredient to daily plan:', err.message);
      res.status(500).send({ error: err.message });
    } else {
      console.error('Unexpected error:', err);
      res.status(500).send({ error: 'Unexpected error' });
    }
  }
};

export { createDailyPlan, getDailyPlans, addMealToDailyPlan, addIngredientToDailyPlan };