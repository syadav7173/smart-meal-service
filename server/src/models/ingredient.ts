import pool from '../db';

interface Ingredient {
  id: number;
  name: string;
  price: number;
  quantity: number;
  store: string;
  user_id: number;
}

const createIngredient = async (name: string, price: number, quantity: number, store: string, user_id: number): Promise<Ingredient> => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO ingredients (name, price, quantity, store, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, price, quantity, store, user_id]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
};

const getIngredients = async (user_id: number): Promise<Ingredient[]> => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM ingredients WHERE user_id = $1', [user_id]);
    return result.rows;
  } finally {
    client.release();
  }
};

const updateIngredient = async (id: number, name: string, price: number, quantity: number, store: string): Promise<Ingredient> => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'UPDATE ingredients SET name = $1, price = $2, quantity = $3, store = $4 WHERE id = $5 RETURNING *',
      [name, price, quantity, store, id]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
};

const deleteIngredient = async (id: number): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM ingredients WHERE id = $1', [id]);
  } finally {
    client.release();
  }
};

export { createIngredient, getIngredients, updateIngredient, deleteIngredient };
