import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import mealRoutes from './routes/meals';
import ingredientRoutes from './routes/ingredients';
import dailyPlansRoutes from './routes/dailyPlans';
import weeklyPlansRoutes from './routes/weeklyPlans'; // Add this line
import dotenv from 'dotenv';

dotenv.config();

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
app.use('/api/dailyPlans', dailyPlansRoutes);
app.use('/api/weeklyPlans', weeklyPlansRoutes); // Add this line

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
