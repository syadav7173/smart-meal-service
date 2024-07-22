import React, { useState } from 'react';
import '../styles/WeekBuilder.css';
import { Ingredient } from '../types';
import { Meal } from '../types';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const WeekBuilder: React.FC = () => {
  const [weekPlan, setWeekPlan] = useState<{ [key: string]: { meals: Meal[], ingredients: Ingredient[] } }>({
    Monday: { meals: [], ingredients: [] },
    Tuesday: { meals: [], ingredients: [] },
    Wednesday: { meals: [], ingredients: [] },
    Thursday: { meals: [], ingredients: [] },
    Friday: { meals: [], ingredients: [] },
    Saturday: { meals: [], ingredients: [] },
    Sunday: { meals: [], ingredients: [] }
  });

  const addMealToDay = (day: string, meal: Meal) => {
    setWeekPlan({
      ...weekPlan,
      [day]: { ...weekPlan[day], meals: [...weekPlan[day].meals, meal] }
    });
  };

  const addIngredientToDay = (day: string, ingredient: Ingredient) => {
    setWeekPlan({
      ...weekPlan,
      [day]: { ...weekPlan[day], ingredients: [...weekPlan[day].ingredients, ingredient] }
    });
  };

  const savePlan = () => {
    console.log('Week Plan:', weekPlan);
  };

  return (
    <div className="week-builder">
      <h1>Week Builder</h1>
      <div className="week-grid">
        {daysOfWeek.map(day => (
          <div key={day} className="day-column">
            <h2>{day}</h2>
            <button onClick={() => addMealToDay(day, { id: 1, name: 'Sample Meal', category: 'Walkable', price: 10, user_id: 1 })}>Add Meal</button>
            <button onClick={() => addIngredientToDay(day, { id: 1, name: 'Sample Ingredient', price: 5, quantity: 1, store: 'Store', user_id: 1 })}>Add Ingredient</button>
            <ul>
              {weekPlan[day].meals.map(meal => (
                <li key={meal.id}>{meal.name}</li>
              ))}
              {weekPlan[day].ingredients.map(ingredient => (
                <li key={ingredient.id}>{ingredient.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <button onClick={savePlan}>Save Plan</button>
    </div>
  );
};

export default WeekBuilder;
