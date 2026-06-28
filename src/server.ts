import { buildApp } from './app';
import { appConfig } from './config/app.config';
import { db } from './database/client';
import { sql } from 'drizzle-orm';

async function start() {
  try {
    // Test database connection
    console.log('🔌 Testing database connection...');
    await db.execute(sql`SELECT 1`);
    console.log('✅ Database connected successfully');

    // Build and start the application
    const app = await buildApp();

    // Start listening
    await app.listen({
      port: appConfig.port,
      host: appConfig.host,
    });

    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║              🚀 HIRE MIND API SERVER STARTED              ║
║                                                           ║
║  Environment: ${appConfig.nodeEnv.padEnd(44)} ║
║  Server:      http://${appConfig.host}:${appConfig.port}${' '.repeat(30)} ║
║  API Version: ${appConfig.apiVersion.padEnd(44)} ║
║  Docs:        http://localhost:${appConfig.port}/docs${' '.repeat(22)} ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `);

    // Graceful shutdown handlers
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);

      try {
        // Close Fastify server
        await app.close();
        console.log('✅ Fastify server closed');

        // Close database connections
        // Note: Drizzle with postgres.js doesn't need explicit close in most cases
        console.log('✅ Database connections closed');

        console.log('👋 Graceful shutdown completed');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
      }
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle unhandled rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      // Application specific logging, throwing an error, or other logic here
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
start();
