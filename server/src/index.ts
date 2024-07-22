import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import mealRoutes from './routes/meals';
import ingredientRoutes from './routes/ingredients';
import dotenv from 'dotenv';

dotenv.config();

console.log('Environment Variables:', {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
});

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

app.get('/', (req, res) => {
  res.send('Smart Meal Service API');
});

app.use('/api/auth', authRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/ingredients', ingredientRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
