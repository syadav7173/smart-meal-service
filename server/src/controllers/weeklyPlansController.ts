import { Request, Response } from 'express';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const createWeeklyPlan = async (req: Request, res: Response) => {
  const { start_date, end_date, user_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO weeklyPlans (start_date, end_date, user_id) VALUES ($1, $2, $3) RETURNING *',
      [start_date, end_date, user_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

const getWeeklyPlanByDate = async (req: Request, res: Response) => {
    const { date, user_id } = req.query;

    if (!date || !user_id) {
      return res.status(400).send('Missing date or user_id');
    }

    const inputDate = new Date(date as string);
    const startOfWeek = new Date(inputDate);
    const dayOfWeek = startOfWeek.getUTCDay();
    const startOfWeekDate = new Date(startOfWeek);
    startOfWeekDate.setUTCDate(startOfWeek.getUTCDate() - dayOfWeek);
    const endOfWeekDate = new Date(startOfWeekDate);
    endOfWeekDate.setUTCDate(startOfWeekDate.getUTCDate() + 6);
    const startOfWeekISOString = startOfWeekDate.toISOString().split('T')[0];
    const endOfWeekISOString = endOfWeekDate.toISOString().split('T')[0];

    console.log('Start of week:', startOfWeekISOString);
    console.log('End of week:', endOfWeekISOString);

    try {
      const resQuery = await pool.query(
        'SELECT * FROM weeklyPlans WHERE user_id = $1 AND start_date = $2',
        [user_id, startOfWeekISOString]
      );

      if (resQuery.rows.length > 0) {
        return res.json(resQuery.rows[0]);
      }

      const result = await pool.query(
        'INSERT INTO weeklyPlans (start_date, end_date, user_id) VALUES ($1, $2, $3) RETURNING *',
        [startOfWeekISOString, endOfWeekISOString, user_id]
      );

      const weeklyPlan = result.rows[0];

      // Automatically create daily plans for each day of the week
      for (let i = 0; i < 7; i++) {
        const dailyPlanDate = new Date(startOfWeekISOString);
        dailyPlanDate.setUTCDate(dailyPlanDate.getUTCDate() + i);
        await pool.query(
          'INSERT INTO dailyPlans (date, user_id, weekly_plan_id) VALUES ($1, $2, $3)',
          [dailyPlanDate.toISOString().split('T')[0], user_id, weeklyPlan.id]
        );
      }

      return res.json(weeklyPlan);
    } catch (err) {
      console.error('Error fetching or creating weekly plan:', err);
      res.status(500).send('Server Error');
    }
  };

export { createWeeklyPlan, getWeeklyPlanByDate };
