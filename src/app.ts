import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import cookie from '@fastify/cookie';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { appConfig } from './config/app.config';
import { corsConfig } from './config/cors.config';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
      ...(process.env.NODE_ENV === 'development' && {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        },
      }),
    },
    requestIdLogLabel: 'requestId',
    disableRequestLogging: false,
    trustProxy: true,
  });

  // Register plugins
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  });

  await app.register(cors, {
    origin: corsConfig.origin,
    credentials: corsConfig.credentials,
    methods: corsConfig.methods,
  });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: '15 minutes',
  });

  await app.register(cookie, {
    secret: process.env.COOKIE_SECRET || process.env.JWT_SECRET,
    parseOptions: {},
  });

  // Swagger documentation
  if (process.env.NODE_ENV !== 'production') {
    await app.register(swagger, {
      swagger: {
        info: {
          title: 'Hire Mind API',
          description: `
# 🚀 Hire Mind - AI-Powered Job Portal API

Complete REST API for job portal with authentication, job posting, applications, and more.

## 🔑 Authentication

This API uses **JWT (JSON Web Tokens)** for authentication.

### How to Authenticate:

1. **Register** a new account: \`POST /api/v1/auth/register\`
2. **Login** to get tokens: \`POST /api/v1/auth/login\`
3. **Use Access Token**: Add \`Authorization: Bearer <access_token>\` header to protected routes
4. **Refresh Token**: When access token expires (15 min), use \`POST /api/v1/auth/refresh\`

### Token Types:

- **Access Token**: Short-lived (15 minutes) - use for API requests
- **Refresh Token**: Long-lived (7 days) - use to get new access token

## 📋 Available Features

### Authentication
- ✅ Register with email/password
- ✅ Login with JWT tokens
- ✅ Email verification
- ✅ Password reset
- ✅ OAuth (Google, GitHub, Microsoft, Apple, LinkedIn) - Coming soon
- ✅ Role-based access control (USER, RECRUITER, ADMIN, SUPER_ADMIN)

### Coming Soon
- 👥 User Management
- 💼 Job Postings
- 📝 Applications
- 🏢 Companies
- 📄 Resumes
- 🔔 Notifications

## 🔒 Security Features

- Password hashing with bcrypt
- JWT with short-lived access tokens
- HTTP-only refresh tokens
- Token rotation
- Rate limiting
- CORS protection
- Input validation

## 📚 Response Format

All responses follow this format:

\`\`\`json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2024-06-28T10:30:00.000Z"
}
\`\`\`

Error responses:

\`\`\`json
{
  "success": false,
  "statusCode": 400,
  "code": "VALIDATION_ERROR",
  "message": "Error description",
  "timestamp": "2024-06-28T10:30:00.000Z"
}
\`\`\`

## 🎯 Getting Started

1. Register a new account
2. Verify your email (check verification endpoint)
3. Login to get access token
4. Use the access token in the **Authorize** button above
5. Try protected endpoints!

## 📞 Support

For issues or questions, contact the development team.
          `,
          version: '1.0.0',
          contact: {
            name: 'Hire Mind Team',
            email: 'support@hiremind.com',
          },
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT',
          },
        },
        host: `localhost:${appConfig.port}`,
        schemes: ['http', 'https'],
        consumes: ['application/json'],
        produces: ['application/json'],
        tags: [
          { 
            name: 'Authentication', 
            description: 'User authentication and account management endpoints',
          },
          { 
            name: 'Users', 
            description: 'User management endpoints (Coming soon)',
          },
          { 
            name: 'Jobs', 
            description: 'Job posting and search endpoints (Coming soon)',
          },
          { 
            name: 'Applications', 
            description: 'Job application management endpoints (Coming soon)',
          },
          { 
            name: 'Companies', 
            description: 'Company profile endpoints (Coming soon)',
          },
          { 
            name: 'Resumes', 
            description: 'Resume upload and management endpoints (Coming soon)',
          },
          { 
            name: 'Health', 
            description: 'Health check and system status endpoints',
          },
        ],
        securityDefinitions: {
          bearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            description: 'Enter your JWT token in the format: **Bearer &lt;token&gt;**\n\nExample: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`\n\nGet your token by:\n1. Register: POST /api/v1/auth/register\n2. Login: POST /api/v1/auth/login\n3. Copy the `accessToken` from response',
          },
        },
      },
    });

    await app.register(swaggerUI, {
      routePrefix: '/docs',
      uiConfig: {
        docExpansion: 'list',
        deepLinking: true,
      },
      staticCSP: true,
      transformStaticCSP: (header) => header,
    });
  }

  // Register routes
  await app.register(routes);

  // Register error handler
  app.setErrorHandler(errorHandler);

  // Not found handler
  app.setNotFoundHandler((request, reply) => {
    reply.code(404).send({
      success: false,
      statusCode: 404,
      code: 'NOT_FOUND',
      message: `Route ${request.method}:${request.url} not found`,
      timestamp: new Date().toISOString(),
    });
  });

  return app;
}
