import React from 'react';
import { Meal } from '../../types';

interface WeekBuilderProps {
  selectedDay: string | null;
  weekPlan: { [key: string]: { meals: Meal[], ingredients: any[] } };
  selectDay: (day: string) => void;
}

const WeekBuilder: React.FC<WeekBuilderProps> = ({ selectedDay, weekPlan, selectDay }) => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="week-builder-section box">
      <h2>Week Builder</h2>
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
                  {weekPlan[day]?.meals.map((meal: Meal, index: number) => (
                    <li key={`${meal.id}-${index}`}>{meal.name}</li>
                  ))}
                </ul>
                <h4>Ingredients</h4>
                <ul className="day-plan">
                  {weekPlan[day]?.ingredients.map((ingredient: any, index: number) => (
                    <li key={`${ingredient.id}-${index}`}>{ingredient.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekBuilder;
