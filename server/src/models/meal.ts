import pool from '../db';

interface Meal {
  id: number;
  name: string;
  category: string;
  price: number;
  user_id: number;
}

const createMeal = async (name: string, category: string, price: number, user_id: number): Promise<Meal> => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO meals (name, category, price, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, category, price, user_id]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
};

const getMeals = async (user_id: number): Promise<Meal[]> => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM meals WHERE user_id = $1', [user_id]);
    return result.rows;
  } finally {
    client.release();
  }
};

const updateMeal = async (id: number, name: string, category: string, price: number): Promise<Meal> => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'UPDATE meals SET name = $1, category = $2, price = $3 WHERE id = $4 RETURNING *',
      [name, category, price, id]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
};

const deleteMeal = async (id: number): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM meals WHERE id = $1', [id]);
  } finally {
    client.release();
  }
};

export { createMeal, getMeals, updateMeal, deleteMeal };
