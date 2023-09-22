import { sql } from '@vercel/postgres';
import { drizzle as postgresDrizzle } from 'drizzle-orm/postgres-js';
import { drizzle as vercelDrizzle } from 'drizzle-orm/vercel-postgres';
import postgres from 'postgres';
import { configService } from '../config/config.service';
import { Schema } from './index';

const options = { schema: Schema };

export const db =
	configService.nodeEnv === 'production'
		? vercelDrizzle(sql, options)
		: // biome-ignore lint/style/noNonNullAssertion: This is unsafe but it's okay since this code path only triggers in development
		  postgresDrizzle(postgres(process.env.POSTGRES_URL!), options);

export type Db = typeof db;
