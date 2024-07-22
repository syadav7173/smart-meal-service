import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const createMeal = async (name: string, category: string, price: number, userId: number) => {
  const result = await pool.query(
    'INSERT INTO meals (name, category, price, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, category, price, userId]
  );
  return result.rows[0];
};

const getMeals = async (userId: number) => {
  const result = await pool.query('SELECT * FROM meals WHERE user_id = $1', [userId]);
  return result.rows;
};

const editMeal = async (id: number, name: string, category: string, price: number) => {
  const result = await pool.query(
    'UPDATE meals SET name = $1, category = $2, price = $3 WHERE id = $4 RETURNING *',
    [name, category, price, id]
  );
  return result.rows[0];
};

const removeMeal = async (id: number) => {
  await pool.query('DELETE FROM meals WHERE id = $1', [id]);
};

export { createMeal, getMeals, editMeal, removeMeal };
