import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Ingredient } from '../../types';

const Ingredients: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [store, setStore] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found, authorization denied');
          return;
        }

        const res: AxiosResponse<Ingredient[]> = await axios.get('http://localhost:5001/api/ingredients', {
          headers: {
            'x-auth-token': token,
          },
        });
        setIngredients(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch ingredients');
      }
    };

    fetchIngredients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, authorization denied');
        return;
      }

      const res: AxiosResponse<Ingredient> = await axios.post(
        'http://localhost:5001/api/ingredients',
        { name, price: parseFloat(price), quantity: parseInt(quantity), store },
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );
      setIngredients([...ingredients, res.data]);
      setName('');
      setPrice('');
      setQuantity('');
      setStore('');
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to add ingredient');
    }
  };

  return (
    <div>
      <h1>Ingredients</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <label>Price</label>
        <input value={price} onChange={(e) => setPrice(e.target.value)} />
        <label>Quantity</label>
        <input value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        <label>Store</label>
        <input value={store} onChange={(e) => setStore(e.target.value)} />
        <button type="submit">Add Ingredient</button>
      </form>
      <ul>
        {ingredients.map((ingredient) => (
          <li key={ingredient.id}>
            {ingredient.name} - {ingredient.quantity} - ${ingredient.price} - {ingredient.store}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Ingredients;
