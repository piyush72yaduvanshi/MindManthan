import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { databaseConfig } from '../config/database.config';
import * as schema from './schema';
import * as relations from './relations';

// Create PostgreSQL connection
const connectionString = `postgresql://${databaseConfig.user}:${databaseConfig.password}@${databaseConfig.host}:${databaseConfig.port}/${databaseConfig.database}${databaseConfig.ssl ? '?sslmode=require' : ''}`;

// Create postgres client
const queryClient = postgres(connectionString, {
  max: databaseConfig.max,
  idle_timeout: databaseConfig.idleTimeoutMillis / 1000,
  connect_timeout: databaseConfig.connectionTimeoutMillis / 1000,
});

// Create Drizzle instance with schema and relations
export const db = drizzle(queryClient, { 
  schema: { ...schema, ...relations } 
});

// Export types
export type Database = typeof db;

// Close connection (for graceful shutdown)
export const closeDatabase = async () => {
  await queryClient.end();
};
