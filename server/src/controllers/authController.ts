import { Request, Response } from 'express';
import { registerUser, authenticateUser } from '../services/userService';

const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    const user = await registerUser(username, email, password);
    res.json(user);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error message:', err.message);
      console.error('Stack trace:', err.stack);
    } else {
      console.error('Unexpected error', err);
    }
    res.status(500).send('Server Error');
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const token = await authenticateUser(email, password);
    res.json({ token });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error message:', err.message);
      console.error('Stack trace:', err.stack);
      res.status(400).json({ msg: 'Invalid Credentials', error: err.message });
    } else {
      console.error('Unexpected error', err);
      res.status(400).json({ msg: 'Invalid Credentials', error: 'Unexpected error' });
    }
  }
};

export { register, login };
