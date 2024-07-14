import pool from '../db';

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

const createUser = async (username: string, email: string, password: string): Promise<User> => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, password]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
};

const getUserByEmail = async (email: string): Promise<User | null> => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  } finally {
    client.release();
  }
};

export { createUser, getUserByEmail };
