import { drizzle } from 'drizzle-orm/neon-http';
import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { env } from '@/lib/env';
import * as schema from './schema';

type Db = ReturnType<typeof drizzle<typeof schema>>;

const cache: { client?: NeonQueryFunction<false, false>; db?: Db } = {};

export function getRawSql(): NeonQueryFunction<false, false> {
  cache.client ??= neon(env.databaseUrl);
  return cache.client;
}

export function getDb(): Db {
  cache.db ??= drizzle(getRawSql(), { schema });
  return cache.db;
}
