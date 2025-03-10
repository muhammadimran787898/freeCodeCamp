import assert from 'node:assert';
import path from 'node:path';
import { config } from 'dotenv';

const envPath = path.resolve(__dirname, '../../.env');
const { error } = config({ path: envPath });

if (error) {
  console.warn(`
  ----------------------------------------------------
  Warning: .env file not found.
  ----------------------------------------------------
  Please copy sample.env to .env

  You can ignore this warning if using a different way
  to setup this environment.
  ----------------------------------------------------
  `);
}

assert.ok(process.env.NODE_ENV);
assert.ok(process.env.AUTH0_DOMAIN);
assert.ok(process.env.AUTH0_AUDIENCE);

if (process.env.NODE_ENV !== 'development') {
  assert.ok(process.env.PORT);
  assert.ok(process.env.MONGOHQ_URL);
}

export const MONGOHQ_URL =
  process.env.MONGOHQ_URL || 'mongodb://localhost:27017/freecodecamp';
export const NODE_ENV = process.env.NODE_ENV;
export const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
export const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE;
export const PORT = process.env.PORT || '3000';
