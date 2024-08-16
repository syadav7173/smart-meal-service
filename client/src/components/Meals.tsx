import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Meal } from '../../types';

const Meals: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found, authorization denied');
          return;
        }

        const res: AxiosResponse<Meal[]> = await axios.get('http://localhost:5001/api/meals', {
          headers: {
            'x-auth-token': token,
          },
        });
        setMeals(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch meals');
      }
    };
    fetchMeals();
  }, []);

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, authorization denied');
        return;
      }

      const res: AxiosResponse<Meal> = await axios.post(
        'http://localhost:5001/api/meals',
        { name, category, price },
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );
      setMeals([...meals, res.data]);
      setName('');
      setCategory('');
      setPrice('');
    } catch (err) {
      console.error(err);
      setError('Failed to add meal');
    }
  };

  return (
    <div>
      <h2>Meals</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleAddMeal}>
        <div>
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Category</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>
        <div>
          <label>Price</label>
          <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <button type="submit">Add Meal</button>
      </form>
      <ul>
        {meals.map((meal) => (
          <li key={meal.id}>{meal.name} - {meal.category} - ${meal.price}</li>
        ))}
      </ul>
    </div>
  );
};

export default Meals;
