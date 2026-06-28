import { FastifyInstance } from 'fastify';
import v1Routes from './v1';

export default async function routes(fastify: FastifyInstance) {
  // Register API v1 routes
  fastify.register(v1Routes, { prefix: '/api/v1' });

  // Health check route
  fastify.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }));
}
