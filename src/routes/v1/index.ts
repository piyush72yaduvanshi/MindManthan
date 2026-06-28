import { FastifyInstance } from 'fastify';
import authRoutes from '../../modules/auth/auth.routes';

export default async function v1Routes(fastify: FastifyInstance) {
  // Register auth routes
  fastify.register(authRoutes, { prefix: '/auth' });

  // TODO: Register other module routes
  // fastify.register(usersRoutes, { prefix: '/users' });
  // fastify.register(jobsRoutes, { prefix: '/jobs' });
  // fastify.register(companiesRoutes, { prefix: '/companies' });
  // fastify.register(applicationsRoutes, { prefix: '/applications' });
}
