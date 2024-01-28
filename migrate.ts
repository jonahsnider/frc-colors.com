import { LogLevels, consola } from 'consola';
import { MigrationConfig } from 'drizzle-orm/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { cleanEnv, str } from 'envalid';
import postgres from 'postgres';

consola.level = LogLevels.verbose;

consola.start('Migration script started');

consola.withTag('env').debug('Validating environment variables');
const env = cleanEnv(process.env, {
	// biome-ignore lint/style/useNamingConvention: This is an environment variable
	DATABASE_URL: str({ desc: 'PostgreSQL URL' }),
});

const migrationOptions = {
	migrationsFolder: './drizzle',
} satisfies MigrationConfig;

consola.withTag('db').info('Connecting to database');
const client = postgres(env.DATABASE_URL, { max: 1 });
const db = drizzle(client);

consola.withTag('migrations').start('Running migrations');
await migrate(db, migrationOptions);
consola.withTag('migrations').success('Migrations finished');

consola.withTag('db').info('Closing database connection');
await client.end();
consola.withTag('db').success('Database connection closed');

consola.success('Migration script finished');
