import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const addIngredient = async (name: string, price: number, quantity: number, store: string, userId: number) => {
  try {
    const result = await pool.query(
      'INSERT INTO ingredients (name, price, quantity, store, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, price, quantity, store, userId]
    );
    return result.rows[0];
  } catch (err) {
    console.error('Error adding ingredient:', err);
    throw new Error('Failed to add ingredient');
  }
};

const fetchIngredients = async (userId: number) => {
  try {
    const result = await pool.query('SELECT * FROM ingredients WHERE user_id = $1', [userId]);
    return result.rows;
  } catch (err) {
    console.error('Error fetching ingredients:', err);
    throw new Error('Failed to fetch ingredients');
  }
};

const editIngredient = async (id: number, name: string, price: number, quantity: number, store: string) => {
  try {
    const result = await pool.query(
      'UPDATE ingredients SET name = $1, price = $2, quantity = $3, store = $4 WHERE id = $5 RETURNING *',
      [name, price, quantity, store, id]
    );
    return result.rows[0];
  } catch (err) {
    console.error('Error editing ingredient:', err);
    throw new Error('Failed to edit ingredient');
  }
};

const removeIngredient = async (id: number) => {
  try {
    await pool.query('DELETE FROM ingredients WHERE id = $1', [id]);
  } catch (err) {
    console.error('Error removing ingredient:', err);
    throw new Error('Failed to remove ingredient');
  }
};

export { addIngredient, fetchIngredients, editIngredient, removeIngredient };
