import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { configService } from '../config/config.service';
import { Schema } from './index';

const options = { schema: Schema };

export const db = drizzle(postgres(configService.databaseUrl), options);

export type Db = typeof db;
