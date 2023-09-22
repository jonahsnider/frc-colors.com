import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { Schema } from './index';

const options = { schema: Schema };

export const db = drizzle(sql, options);

export type Db = typeof db;
