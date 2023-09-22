import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { migrate } from 'drizzle-orm/vercel-postgres/migrator';

const migrationOptions = {
	migrationsFolder: './drizzle',
};

const db = drizzle(sql);

await migrate(db, migrationOptions);

await sql.end();
