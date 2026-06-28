import { FastifyInstance } from 'fastify';
import { AuthController } from './auth.controller';
import { authenticateUser } from '../../middleware/auth.middleware';

export default async function authRoutes(fastify: FastifyInstance) {
  const controller = new AuthController();

  // ===== PUBLIC ROUTES =====

  // Register
  fastify.post('/register', {
    schema: {
      summary: 'Register a new user',
      description: 'Create a new user account with email and password. Sends verification email.',
      tags: ['Authentication'],
      body: {
        type: 'object',
        required: ['email', 'password', 'fullName'],
        properties: {
          email: { 
            type: 'string', 
            format: 'email',
            description: 'Valid email address'
          },
          password: { 
            type: 'string', 
            minLength: 8,
            description: 'Password (min 8 chars, must include uppercase, lowercase, number, special char)'
          },
          fullName: { 
            type: 'string', 
            minLength: 2,
            maxLength: 100,
            description: 'User full name'
          },
          role: { 
            type: 'string', 
            enum: ['USER', 'RECRUITER'],
            description: 'User role (defaults to USER)'
          },
        },
        examples: [
          {
            email: 'john.doe@example.com',
            password: 'SecurePass123!',
            fullName: 'John Doe',
            role: 'USER'
          }
        ]
      },
      response: {
        201: {
          description: 'User registered successfully',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { 
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    email: { type: 'string' },
                    role: { type: 'string' },
                    provider: { type: 'string' },
                    isVerified: { type: 'boolean' },
                    isActive: { type: 'boolean' },
                    createdAt: { type: 'string' },
                    updatedAt: { type: 'string' },
                  }
                },
                tokens: {
                  type: 'object',
                  properties: {
                    accessToken: { type: 'string' },
                    refreshToken: { type: 'string' },
                  }
                }
              }
            },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        400: {
          description: 'Bad Request - Validation error',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            statusCode: { type: 'number' },
            code: { type: 'string' },
            message: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        409: {
          description: 'Conflict - Email already exists',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            statusCode: { type: 'number' },
            code: { type: 'string' },
            message: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    handler: controller.register.bind(controller),
  });

  // Login
  fastify.post('/login', {
    schema: {
      summary: 'Login with email and password',
      description: `Authenticate user and receive JWT tokens. Email must be verified.
      
**Important:**
- **Access Token**: Use in Authorization header for API calls (Bearer <accessToken>)
- **Refresh Token**: Automatically stored in HTTP-only cookie for security
- **Access Token Expiry**: 15 minutes
- **Refresh Token Expiry**: 7 days

**How to use:**
1. Copy accessToken from response
2. Use it in Authorization header: "Bearer <accessToken>"
3. When expired, call /refresh to get new tokens`,
      tags: ['Authentication'],
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { 
            type: 'string', 
            format: 'email',
            description: 'User email address'
          },
          password: { 
            type: 'string',
            description: 'User password'
          },
        },
        examples: [
          {
            email: 'john.doe@example.com',
            password: 'SecurePass123!'
          }
        ]
      },
      response: {
        200: {
          description: 'Login successful',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { 
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    email: { type: 'string' },
                    role: { type: 'string' },
                    provider: { type: 'string' },
                    isVerified: { type: 'boolean' },
                    isActive: { type: 'boolean' },
                    lastLoginAt: { type: 'string', nullable: true },
                    createdAt: { type: 'string' },
                    updatedAt: { type: 'string' },
                  }
                },
                tokens: {
                  type: 'object',
                  properties: {
                    accessToken: { type: 'string' },
                    refreshToken: { type: 'string' },
                  }
                }
              }
            },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        401: {
          description: 'Unauthorized - Invalid credentials',
          type: 'object',
        },
      },
    },
    handler: controller.login.bind(controller),
  });

  // Refresh Token
  fastify.post('/refresh', {
    schema: {
      summary: 'Refresh access token',
      description: `Exchange refresh token for new access token and refresh token (token rotation).

**Token Rotation (Security Best Practice):**
1. Old Refresh Token → Verified
2. Old Refresh Token → Invalidated
3. New Refresh Token → Generated & Stored
4. New Access Token → Generated
5. Both New Tokens → Returned

**How it works:**
- Refresh token automatically sent from HTTP-only cookie
- Or can be manually sent in request body
- Returns new accessToken + refreshToken
- Old refresh token becomes invalid (prevents replay attacks)`,
      tags: ['Authentication'],
      body: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: { 
            type: 'string',
            description: 'Valid refresh token'
          },
        },
        examples: [
          {
            refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
          }
        ]
      },
      response: {
        200: {
          description: 'Token refreshed successfully',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { 
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    email: { type: 'string' },
                    role: { type: 'string' },
                    provider: { type: 'string' },
                    isVerified: { type: 'boolean' },
                    isActive: { type: 'boolean' },
                    createdAt: { type: 'string' },
                    updatedAt: { type: 'string' },
                  }
                },
                tokens: {
                  type: 'object',
                  properties: {
                    accessToken: { type: 'string' },
                    refreshToken: { type: 'string' },
                  }
                }
              }
            },
            timestamp: { type: 'string' },
          },
        },
        401: {
          description: 'Unauthorized - Invalid refresh token',
          type: 'object',
        },
      },
    },
    handler: controller.refreshToken.bind(controller),
  });

  // Forgot Password
  fastify.post('/forgot-password', {
    schema: {
      summary: 'Request password reset',
      description: 'Send password reset email with token. Token expires in 1 hour.',
      tags: ['Authentication'],
      body: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { 
            type: 'string', 
            format: 'email',
            description: 'Registered email address'
          },
        },
        examples: [
          {
            email: 'john.doe@example.com'
          }
        ]
      },
      response: {
        200: {
          description: 'Password reset email sent',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'null' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    handler: controller.forgotPassword.bind(controller),
  });

  // Reset Password
  fastify.post('/reset-password', {
    schema: {
      summary: 'Reset password with token',
      description: 'Reset password using token from email. Invalidates all sessions.',
      tags: ['Authentication'],
      body: {
        type: 'object',
        required: ['token', 'password'],
        properties: {
          token: { 
            type: 'string',
            description: 'Password reset token from email'
          },
          password: { 
            type: 'string', 
            minLength: 8,
            description: 'New password (min 8 chars, must include uppercase, lowercase, number, special char)'
          },
        },
        examples: [
          {
            token: 'abc123xyz789resettoken',
            password: 'NewSecurePass456!'
          }
        ]
      },
      response: {
        200: {
          description: 'Password reset successfully',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'null' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        400: {
          description: 'Bad Request - Weak password',
          type: 'object',
        },
        401: {
          description: 'Unauthorized - Invalid or expired token',
          type: 'object',
        },
      },
    },
    handler: controller.resetPassword.bind(controller),
  });

  // Verify Email
  fastify.post('/verify-email', {
    schema: {
      summary: 'Verify email address',
      description: 'Verify email using token from registration email. Token expires in 24 hours.',
      tags: ['Authentication'],
      body: {
        type: 'object',
        required: ['token'],
        properties: {
          token: { 
            type: 'string',
            description: 'Email verification token'
          },
        },
        examples: [
          {
            token: 'verifyemail123abc456xyz789'
          }
        ]
      },
      response: {
        200: {
          description: 'Email verified successfully',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'null' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        401: {
          description: 'Unauthorized - Invalid or expired token',
          type: 'object',
        },
      },
    },
    handler: controller.verifyEmail.bind(controller),
  });

  // Resend Verification
  fastify.post('/resend-verification', {
    schema: {
      summary: 'Resend email verification',
      description: 'Resend verification email. Only works for unverified accounts.',
      tags: ['Authentication'],
      body: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { 
            type: 'string', 
            format: 'email',
            description: 'Registered email address'
          },
        },
        examples: [
          {
            email: 'john.doe@example.com'
          }
        ]
      },
      response: {
        200: {
          description: 'Verification email sent',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'null' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    handler: controller.resendVerification.bind(controller),
  });

  // ===== PROTECTED ROUTES (Require Authentication) =====

  // Get Current User
  fastify.get('/me', {
    preHandler: [authenticateUser],
    schema: {
      summary: 'Get current authenticated user',
      description: `Retrieve current user profile information. Requires valid access token.

**How to use:**
1. Get accessToken from login/register response
2. Add to Authorization header: "Bearer <accessToken>"
3. Call this endpoint

**Example:**
\`\`\`
GET /api/v1/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\``,
      tags: ['Authentication'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'Current user data retrieved successfully',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { 
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                role: { type: 'string' },
                provider: { type: 'string' },
                isVerified: { type: 'boolean' },
                isActive: { type: 'boolean' },
                lastLoginAt: { type: 'string', nullable: true },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
              }
            },
            timestamp: { type: 'string' },
          },
        },
        401: {
          description: 'Unauthorized - Invalid or expired token',
          type: 'object',
        },
      },
    },
    handler: controller.getCurrentUser.bind(controller),
  });

  // Logout
  fastify.post('/logout', {
    preHandler: [authenticateUser],
    schema: {
      summary: 'Logout user',
      description: 'Invalidate refresh token and logout user from current session.',
      tags: ['Authentication'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'Logged out successfully',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'null' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        401: {
          description: 'Unauthorized - Invalid token',
          type: 'object',
        },
      },
    },
    handler: controller.logout.bind(controller),
  });

  // Change Password
  fastify.post('/change-password', {
    preHandler: [authenticateUser],
    schema: {
      summary: 'Change password',
      description: 'Change password for authenticated user. Requires current password. Invalidates all sessions.',
      tags: ['Authentication'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['currentPassword', 'newPassword'],
        properties: {
          currentPassword: { 
            type: 'string',
            description: 'Current password'
          },
          newPassword: { 
            type: 'string', 
            minLength: 8,
            description: 'New password (min 8 chars, must include uppercase, lowercase, number, special char)'
          },
        },
        examples: [
          {
            currentPassword: 'SecurePass123!',
            newPassword: 'NewSecurePass456!'
          }
        ]
      },
      response: {
        200: {
          description: 'Password changed successfully',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'null' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        400: {
          description: 'Bad Request - Incorrect current password or weak new password',
          type: 'object',
        },
        401: {
          description: 'Unauthorized - Invalid token',
          type: 'object',
        },
      },
    },
    handler: controller.changePassword.bind(controller),
  });

  // Deactivate Account
  fastify.delete('/account', {
    preHandler: [authenticateUser],
    schema: {
      summary: 'Deactivate account',
      description: 'Soft delete user account. Account can be restored by contacting support.',
      tags: ['Authentication'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'Account deactivated successfully',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'null' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        401: {
          description: 'Unauthorized - Invalid token',
          type: 'object',
        },
      },
    },
    handler: controller.deactivateAccount.bind(controller),
  });
}
