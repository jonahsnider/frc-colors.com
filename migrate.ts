import { MigrationConfig } from 'drizzle-orm/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { cleanEnv, str } from 'envalid';
import pino from 'pino';
import postgres from 'postgres';

const logger = pino({
	transport:
		process.env.NODE_ENV === 'development'
			? {
					target: 'pino-pretty',
			  }
			: undefined,
});

logger.info('Migration script started');

logger.child({ module: 'env' }).debug('Validating environment variables');
const env = cleanEnv(process.env, {
	// biome-ignore lint/style/useNamingConvention: This is an environment variable
	DATABASE_URL: str({ desc: 'PostgreSQL URL' }),
});

const migrationOptions = {
	migrationsFolder: './drizzle',
} satisfies MigrationConfig;

logger.child({ module: 'db' }).info('Connecting to database');
const client = postgres(env.DATABASE_URL, { max: 1 });
const db = drizzle(client);

logger.child({ module: 'migrations' }).info('Running migrations');
await migrate(db, migrationOptions);
logger.child({ module: 'migrations' }).info('Migrations finished');

logger.child({ module: 'db' }).info('Closing database connection');
await client.end();
logger.child({ module: 'db' }).info('Database connection closed');

logger.info('Migration script finished');
