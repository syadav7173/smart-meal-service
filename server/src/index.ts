import express from 'express';
import cors from 'cors';
import db from './db';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

app.get('/', (req, res) => {
  res.send('Smart Meal Service API');
});

app.get('/api/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json(result.rows);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error message:', err.message);
      console.error('Stack trace:', err.stack);
    } else {
      console.error('Unexpected error', err);
    }
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
