import { defineRelations } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { configService } from '../config/config.service.ts';
import { Schema } from './index.ts';

const relations = defineRelations(Schema);

const client = postgres(configService.databaseUrl);
export const db = drizzle({ client, relations });
