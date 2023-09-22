import assert from 'assert';
import { config } from 'dotenv';
import type { Config } from 'drizzle-kit';

config();

const connectionString = process.env.POSTGRES_URL_NON_POOLING ?? process.env.POSTGRES_URL;
assert(connectionString, 'POSTGRES_URL_NON_POOLING or POSTGRES_URL environment variable must be defined');

export default {
	schema: 'app/api/_lib/db/schema.ts',
	driver: 'pg',
	dbCredentials: {
		connectionString,
	},
	tablesFilter: ['!_prisma_migrations'],
	out: 'drizzle',
} satisfies Config;
