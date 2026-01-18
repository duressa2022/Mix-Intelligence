import { neon } from '@neondatabase/serverless';

let cachedDb: ReturnType<typeof neon> | null = null;

export function getDb() {
  if (!cachedDb) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set');
    }
    cachedDb = neon(process.env.DATABASE_URL);
  }
  return cachedDb;
}

export async function query(text: string, params?: unknown[]) {
  const db = getDb();
  // The neon driver requires using .query() for "traditional" (non-tagged-template) calls with placeholders
  // Cast to any because the types might strictly imply tagged template usage
  return (db as any).query(text, params);
}
