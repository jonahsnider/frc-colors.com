import { defineRelations } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { configService } from '../config/config.service.ts';
import { Schema } from './index.ts';

const relations = defineRelations(Schema);

const client = new Client({ connectionString: configService.databaseUrl });
await client.connect();
export const db = drizzle({ client, relations });
