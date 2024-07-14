import dotenv from 'dotenv';
dotenv.config();

console.log('Test Environment Variables:', {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
});
