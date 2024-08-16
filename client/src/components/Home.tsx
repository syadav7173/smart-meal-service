import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import '../styles/Home.css';
import { Ingredient, Meal, DailyPlan, WeeklyPlan } from '../../types';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const Home: React.FC = () => {
  const { user, handleLogout } = useAuth();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);
  const [dailyPlans, setDailyPlans] = useState<{ [key: string]: DailyPlan | null }>({});
  const [meals, setMeals] = useState<Meal[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found, authorization denied');
          return;
        }

        const res: AxiosResponse<Meal[]> = await axios.get('http://localhost:5001/api/meals', {
          headers: { 'x-auth-token': token }
        });
        setMeals(res.data);
        console.log('Fetched meals:', res.data);
      } catch (err) {
        console.error('Failed to fetch meals', err);
      }
    };

    const fetchIngredients = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found, authorization denied');
          return;
        }

        const res: AxiosResponse<Ingredient[]> = await axios.get('http://localhost:5001/api/ingredients', {
          headers: { 'x-auth-token': token }
        });
        setIngredients(res.data);
        console.log('Fetched ingredients:', res.data);
      } catch (err) {
        console.error('Failed to fetch ingredients', err);
      }
    };

    const fetchWeeklyPlanAndDailyPlans = async (date: Date) => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !user?.id) {
          console.error('No token or user ID found, authorization denied');
          return;
        }

        const dateString = date.toISOString().split('T')[0];
        console.log(`Fetching weekly plan for date: ${dateString}, user_id: ${user.id}`);
        const res: AxiosResponse<WeeklyPlan> = await axios.get(`http://localhost:5001/api/weeklyPlans?date=${dateString}&user_id=${user.id}`, {
          headers: { 'x-auth-token': token }
        });

        const weeklyPlan = res.data;
        setWeeklyPlan(weeklyPlan);
        console.log('Fetched weekly plan:', weeklyPlan);

        const dailyPlansRes: AxiosResponse<DailyPlan[]> = await axios.get(`http://localhost:5001/api/dailyPlans?weeklyPlanId=${weeklyPlan.id}`, {
          headers: { 'x-auth-token': token }
        });

        const plans = dailyPlansRes.data.reduce((acc, plan) => {
          const day = new Date(plan.date).toLocaleDateString('en-US', { weekday: 'long' });
          acc[day] = {
            ...plan,
            meals: plan.meals || [],
            ingredients: plan.ingredients || []
          };
          return acc;
        }, {} as { [key: string]: DailyPlan | null });

        setDailyPlans(plans);
        console.log('Fetched daily plans:', plans);
      } catch (err) {
        console.error('Failed to fetch weekly plan and daily plans', err);
      }
    };

    fetchMeals();
    fetchIngredients();
    fetchWeeklyPlanAndDailyPlans(currentDate);
  }, [user, currentDate]);

  const selectDay = (day: string) => {
    setSelectedDay(day);
  };

  const addMealToDay = async (meal: Meal) => {
    console.log(`Attempting to add meal: ${JSON.stringify(meal)} to selected day: ${selectedDay}`);

    if (selectedDay && weeklyPlan) {
      let dailyPlan = dailyPlans[selectedDay];

      console.log(`Current daily plans: ${JSON.stringify(dailyPlans)}`);
      console.log(`Daily plan for selected day (${selectedDay}): ${JSON.stringify(dailyPlan)}`);

      if (!dailyPlan) {
        console.log(`No daily plan found for ${selectedDay}, creating a new one...`);

        const newPlanRes: AxiosResponse<DailyPlan> = await axios.post('http://localhost:5001/api/dailyPlans', {
          date: new Date().toISOString().split('T')[0],
          user_id: user?.id,
          weekly_plan_id: weeklyPlan.id
        }, {
          headers: { 'x-auth-token': localStorage.getItem('token')! }
        });

        dailyPlan = { ...newPlanRes.data, meals: [], ingredients: [] };
        setDailyPlans({ ...dailyPlans, [selectedDay]: dailyPlan });

        console.log(`Created new daily plan for ${selectedDay}: ${JSON.stringify(dailyPlan)}`);
      }

      console.log(`Adding meal to daily plan with ID: ${dailyPlan.id}`);

      const addMealRes = await axios.post('http://localhost:5001/api/dailyPlans/meal', {
        dailyPlanId: dailyPlan.id,
        mealId: meal.id
      }, {
        headers: { 'x-auth-token': localStorage.getItem('token')! }
      });

      console.log(`Add meal response: ${JSON.stringify(addMealRes.data)}`);

      setDailyPlans({
        ...dailyPlans,
        [selectedDay]: {
          ...dailyPlan,
          meals: [...dailyPlan.meals, meal]
        }
      });

      console.log(`Updated daily plan for ${selectedDay}: ${JSON.stringify(dailyPlans[selectedDay])}`);
    } else {
      console.warn(`No selected day or weekly plan available. Cannot add meal.`);
    }
  };

  const addIngredientToDay = async (ingredient: Ingredient) => {
    if (selectedDay && weeklyPlan) {
      let dailyPlan = dailyPlans[selectedDay];

      if (!dailyPlan) {
        const newPlanRes: AxiosResponse<DailyPlan> = await axios.post('http://localhost:5001/api/dailyPlans', {
          date: new Date().toISOString().split('T')[0],
          user_id: user?.id,
          weekly_plan_id: weeklyPlan.id
        }, {
          headers: { 'x-auth-token': localStorage.getItem('token')! }
        });
        dailyPlan = { ...newPlanRes.data, meals: [], ingredients: [] };
        setDailyPlans({ ...dailyPlans, [selectedDay]: dailyPlan });
        console.log(`Created new daily plan for ${selectedDay}:`, dailyPlan);
      }

      await axios.post('http://localhost:5001/api/dailyPlans/ingredient', {
        dailyPlanId: dailyPlan.id,
        ingredientId: ingredient.id
      }, {
        headers: { 'x-auth-token': localStorage.getItem('token')! }
      });

      setDailyPlans({
        ...dailyPlans,
        [selectedDay]: {
          ...dailyPlan,
          ingredients: [...dailyPlan.ingredients, ingredient]
        }
      });
      console.log(`Added ingredient to ${selectedDay}:`, ingredient);
    }
  };

  const getTotalForWeek = () => {
    let total = 0;
    Object.values(dailyPlans).forEach(plan => {
      if (plan) {
        plan.meals.forEach(meal => {
          if (meal && meal.price) {
            total += parseFloat(meal.price.toString());
          }
        });
        plan.ingredients.forEach(ingredient => {
          if (ingredient && ingredient.price) {
            total += parseFloat(ingredient.price.toString());
          }
        });
      }
    });
    return total.toFixed(2);
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="home-container">
      <div className="header">
        <h1>Welcome, {user.email}!</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className="content">
        <div className="left-column">
          <div className="numbers-section box">
            <div className="number-box">
              <h2>This Week</h2>
              <p>${getTotalForWeek()}</p>
            </div>
            <div className="number-box">
              <h2>Last Week</h2>
              <p>$480</p> {/* This should be dynamic; just a placeholder for now */}
            </div>
          </div>
          <div className="week-builder-section box">
            <h2>Week Builder</h2>
            <p>Week: {weeklyPlan?.start_date} - {weeklyPlan?.end_date} (ID: {weeklyPlan?.id})</p>
            <button onClick={goToPreviousWeek}>Previous Week</button>
            <button onClick={goToNextWeek}>Next Week</button>
            <div className="week-grid">
              {daysOfWeek.map(day => (
                <div
                  key={day}
                  className={`day-column ${selectedDay === day ? 'selected' : ''}`}
                  onClick={() => selectDay(day)}
                >
                  <h3 className="day-name">{day}</h3>
                  {selectedDay === day && (
                    <div>
                      <h4>Meals</h4>
                      <ul className="day-plan">
                        {dailyPlans[day]?.meals?.map((meal, index) => (
                          meal ? <li key={`${meal.id}-${index}`}>{meal.name}</li> : null
                        ))}
                      </ul>
                      <h4>Ingredients</h4>
                      <ul className="day-plan">
                        {dailyPlans[day]?.ingredients?.map((ingredient, index) => (
                          ingredient ? <li key={`${ingredient.id}-${index}`}>{ingredient.name}</li> : null
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="meals-ingredients-section box">
          <h2>Meals</h2>
          <div className="item-grid">
            {meals.map(meal => (
              <div key={meal.id} className="meal-item" onClick={() => addMealToDay(meal)}>
                {meal.name} - ${meal.price}
              </div>
            ))}
          </div>
          <button onClick={() => window.location.href = '/meals'}>Add New Meal</button>
          <h2>Ingredients</h2>
          <div className="item-grid">
            {ingredients.map(ingredient => (
              <div key={ingredient.id} className="ingredient-item" onClick={() => addIngredientToDay(ingredient)}>
                {ingredient.name} - ${ingredient.price}
              </div>
            ))}
          </div>
          <button onClick={() => window.location.href = '/ingredients'}>Add New Ingredient</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
