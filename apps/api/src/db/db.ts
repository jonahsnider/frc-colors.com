import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { configService } from '../config/config.service';
import { Schema } from './index';

const options = { schema: Schema };

const client = new Client({ connectionString: configService.databaseUrl });
await client.connect();
export const db = drizzle(client, options);

export type Db = typeof db;
