import * as dotenv from 'dotenv';
dotenv.config();

const APP_PORT = process.env.PORT || 3000;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_PUBLIC_KEY = process.env.STRIPE_PUBLIC_KEY || '';

const DATABASE_TYPE = process.env.DATABASE_TYPE || 'mysql';
const DATABASE_HOST = process.env.DATABASE_HOS || 'localhost';
const DATABASE_PORT = process.env.DATABASE_PORT || '3306';
const DATABASE_USER = process.env.DATABASE_USER || 'root';
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || '123456';
const DATABASE_NAME = process.env.DATABASE_NAME || 'db-wallet';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || '';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || '';
export {
  APP_PORT,
  STRIPE_SECRET_KEY,
  STRIPE_PUBLIC_KEY,
  DATABASE_TYPE,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
};
