import assert from 'assert';
import type { Config } from 'drizzle-kit';

const connectionString = process.env.POSTGRES_URL_NON_POOLING ?? process.env.POSTGRES_URL;
assert(connectionString, 'POSTGRES_URL_NON_POOLING or POSTGRES_URL environment variable must be defined');

// biome-ignore lint/style/noDefaultExport: This must be a default export
export default {
	schema: 'apps/api/src/db/schema.ts',
	driver: 'pg',
	dbCredentials: {
		connectionString,
	},
	tablesFilter: ['!_prisma_migrations'],
	out: 'drizzle',
} satisfies Config;
