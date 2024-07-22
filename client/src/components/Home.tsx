import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import '../styles/Home.css';
import { Ingredient, Meal } from '../types';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Home: React.FC = () => {
  const { user, handleLogout } = useAuth();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [weekPlan, setWeekPlan] = useState<{ [key: string]: { meals: Meal[], ingredients: Ingredient[] } }>({
    Monday: { meals: [], ingredients: [] },
    Tuesday: { meals: [], ingredients: [] },
    Wednesday: { meals: [], ingredients: [] },
    Thursday: { meals: [], ingredients: [] },
    Friday: { meals: [], ingredients: [] },
    Saturday: { meals: [], ingredients: [] },
    Sunday: { meals: [], ingredients: [] }
  });

  const [meals, setMeals] = useState<Meal[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

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
      } catch (err) {
        console.error('Failed to fetch ingredients', err);
      }
    };

    fetchMeals();
    fetchIngredients();
  }, []);

  const selectDay = (day: string) => {
    setSelectedDay(day);
  };

  const addMealToDay = (meal: Meal) => {
    if (selectedDay) {
      setWeekPlan({
        ...weekPlan,
        [selectedDay]: { ...weekPlan[selectedDay], meals: [...weekPlan[selectedDay].meals, meal] }
      });
    }
  };

  const addIngredientToDay = (ingredient: Ingredient) => {
    if (selectedDay) {
      setWeekPlan({
        ...weekPlan,
        [selectedDay]: { ...weekPlan[selectedDay], ingredients: [...weekPlan[selectedDay].ingredients, ingredient] }
      });
    }
  };

  const getTotalForWeek = () => {
    let total = 0;
    Object.values(weekPlan).forEach(dayPlan => {
      dayPlan.meals.forEach(meal => {
        total += parseFloat(meal.price.toString());
      });
      dayPlan.ingredients.forEach(ingredient => {
        total += parseFloat(ingredient.price.toString());
      });
    });
    return total.toFixed(2);
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
            <div className="day-selector">
              {daysOfWeek.map(day => (
                <button
                  key={day}
                  className={`day-button ${selectedDay === day ? 'selected' : ''}`}
                  onClick={() => selectDay(day)}
                >
                  {day}
                </button>
              ))}
            </div>
            {selectedDay && (
              <div className="selected-day-plan">
                <div className="day-plan-section">
                  <h4>Meals</h4>
                  <ul className="day-plan">
                    {weekPlan[selectedDay].meals.map((meal, index) => (
                      <li key={`${meal.id}-${index}`} className="day-plan-item">
                        {meal.name} <br /> ${meal.price}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="day-plan-section">
                  <h4>Ingredients</h4>
                  <ul className="day-plan">
                    {weekPlan[selectedDay].ingredients.map((ingredient, index) => (
                      <li key={`${ingredient.id}-${index}`} className="day-plan-item">
                        {ingredient.name} <br /> ${ingredient.price}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="meals-ingredients-section box">
          <h2>Meals</h2>
          <div className="items-container">
            {meals.map(meal => (
              <div key={meal.id} className="meal-item" onClick={() => addMealToDay(meal)}>
                {meal.name} <br /> ${meal.price}
              </div>
            ))}
          </div>
          <button onClick={() => window.location.href = '/meals'}>Add New Meal</button>
          <h2>Ingredients</h2>
          <div className="items-container">
            {ingredients.map(ingredient => (
              <div key={ingredient.id} className="ingredient-item" onClick={() => addIngredientToDay(ingredient)}>
                {ingredient.name} <br /> ${ingredient.price}
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
