# 📚 API Examples - Hire Mind

Complete examples for all API endpoints with request/response samples.

## 🔑 Authentication

All authenticated endpoints require the `Authorization` header:
```
Authorization: Bearer <access_token>
```

---

## 📋 Authentication Endpoints

### 1. Register

Create a new user account.

**Endpoint:** `POST /api/v1/auth/register`

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!",
    "fullName": "John Doe",
    "role": "USER"
  }'
```

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe",
  "role": "USER"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "john.doe@example.com",
      "role": "USER",
      "provider": "EMAIL",
      "isVerified": false,
      "isActive": true,
      "lastLoginAt": null,
      "createdAt": "2024-06-28T10:30:00.000Z",
      "updatedAt": "2024-06-28T10:30:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  },
  "timestamp": "2024-06-28T10:30:00.000Z"
}
```

**Error Response (409 Conflict):**
```json
{
  "success": false,
  "statusCode": 409,
  "code": "EMAIL_ALREADY_EXISTS",
  "message": "Email john.doe@example.com is already registered",
  "timestamp": "2024-06-28T10:30:00.000Z"
}
```

---

### 2. Login

Authenticate with email and password.

**Endpoint:** `POST /api/v1/auth/login`

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!"
  }'
```

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "john.doe@example.com",
      "role": "USER",
      "provider": "EMAIL",
      "isVerified": true,
      "isActive": true,
      "lastLoginAt": "2024-06-28T10:30:00.000Z",
      "createdAt": "2024-06-27T10:30:00.000Z",
      "updatedAt": "2024-06-28T10:30:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  },
  "timestamp": "2024-06-28T10:30:00.000Z"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "statusCode": 401,
  "code": "INVALID_CREDENTIALS",
  "message": "Invalid email or password",
  "timestamp": "2024-06-28T10:30:00.000Z"
}
```

---

### 3. Get Current User

Get authenticated user profile.

**Endpoint:** `GET /api/v1/auth/me`

**Request:**
```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john.doe@example.com",
    "role": "USER",
    "provider": "EMAIL",
    "isVerified": true,
    "isActive": true,
    "lastLoginAt": "2024-06-28T10:30:00.000Z",
    "createdAt": "2024-06-27T10:30:00.000Z",
    "updatedAt": "2024-06-28T10:30:00.000Z"
  },
  "timestamp": "2024-06-28T10:30:00.000Z"
}
```

---

### 4. Refresh Token

Get new access token using refresh token.

**Endpoint:** `POST /api/v1/auth/refresh`

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "john.doe@example.com",
      "role": "USER"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  },
  "timestamp": "2024-06-28T10:30:00.000Z"
}
```

---

### 5. Verify Email

Verify email address with token.

**Endpoint:** `POST /api/v1/auth/verify-email`

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "token": "a1b2c3d4e5f6g7h8i9j0"
  }'
```

**Request Body:**
```json
{
  "token": "a1b2c3d4e5f6g7h8i9j0"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": null,
  "timestamp": "2024-06-28T10:30:00.000Z"
}
```

---

### 6. Resend Verification Email

Request new verification email.

**Endpoint:** `POST /api/v1/auth/resend-verification`

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/resend-verification \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com"
  }'
```

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Verification email sent",
  "data": null,
  "timestamp": "2024-06-28T10:30:00.000Z"
}
```

---

### 7. Forgot Password

Request password reset email.

**Endpoint:** `POST /api/v1/auth/forgot-password`

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com"
  }'
```

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset email sent",
  "data": null,
  "timestamp": "2024-06-28T10:30:00.000Z"
}
```

---

### 8. Reset Password

Reset password with token from email.

**Endpoint:** `POST /api/v1/auth/reset-password`

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "reset_token_from_email",
    "password": "NewSecurePass123!"
  }'
```

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "password": "NewSecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset successfully",
  "data": null,
  "timestamp": "2024-06-28T10:30:00.000Z"
}
```

---

### 9. Change Password

Change password for authenticated user.

**Endpoint:** `POST /api/v1/auth/change-password`

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/change-password \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "SecurePass123!",
    "newPassword": "NewSecurePass123!"
  }'
```

**Request Body:**
```json
{
  "currentPassword": "SecurePass123!",
  "newPassword": "NewSecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": null,
  "timestamp": "2024-06-28T10:30:00.000Z"
}
```

---

### 10. Logout

Logout current user.

**Endpoint:** `POST /api/v1/auth/logout`

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": null,
  "timestamp": "2024-06-28T10:30:00.000Z"
}
```

---

### 11. Deactivate Account

Soft delete user account.

**Endpoint:** `DELETE /api/v1/auth/account`

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/v1/auth/account \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Account deactivated successfully",
  "data": null,
  "timestamp": "2024-06-28T10:30:00.000Z"
}
```

---

## 🏥 Health Check

### Health Status

Check API health.

**Endpoint:** `GET /health`

**Request:**
```bash
curl -X GET http://localhost:3000/health
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Server is healthy",
  "data": {
    "status": "ok",
    "timestamp": "2024-06-28T10:30:00.000Z",
    "uptime": 12345.67
  },
  "timestamp": "2024-06-28T10:30:00.000Z"
}
```

---

## 🚨 Common Error Responses

### 400 Bad Request - Validation Error
```json
{
  "success": false,
  "statusCode": 400,
  "code": "VALIDATION_ERROR",
  "message": "Validation failed: password must be at least 8 characters",
  "timestamp": "2024-06-28T10:30:00.000Z"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "statusCode": 401,
  "code": "UNAUTHORIZED",
  "message": "Invalid or expired token",
  "timestamp": "2024-06-28T10:30:00.000Z"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "statusCode": 403,
  "code": "FORBIDDEN",
  "message": "You don't have permission to access this resource",
  "timestamp": "2024-06-28T10:30:00.000Z"
}
```

### 404 Not Found
```json
{
  "success": false,
  "statusCode": 404,
  "code": "NOT_FOUND",
  "message": "Resource not found",
  "timestamp": "2024-06-28T10:30:00.000Z"
}
```

### 409 Conflict
```json
{
  "success": false,
  "statusCode": 409,
  "code": "CONFLICT",
  "message": "Resource already exists",
  "timestamp": "2024-06-28T10:30:00.000Z"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "statusCode": 429,
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests. Please try again later",
  "timestamp": "2024-06-28T10:30:00.000Z"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "statusCode": 500,
  "code": "INTERNAL_SERVER_ERROR",
  "message": "An unexpected error occurred",
  "timestamp": "2024-06-28T10:30:00.000Z"
}
```

---

## 🔐 Password Requirements

Passwords must meet these requirements:
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (!@#$%^&*()_+-=[]{}|;:,.<>?)

**Valid Examples:**
- `SecurePass123!`
- `MyP@ssw0rd`
- `Strong#Pass1`

**Invalid Examples:**
- `weak` (too short, no uppercase, no number, no special char)
- `password123` (no uppercase, no special char)
- `PASSWORD123!` (no lowercase)

---

## 📝 Notes

1. **Access Token Expiry**: 15 minutes
2. **Refresh Token Expiry**: 7 days
3. **Verification Token Expiry**: 24 hours
4. **Reset Token Expiry**: 1 hour
5. **Rate Limit**: 100 requests per 15 minutes

---

## 🧪 Testing with Postman

1. Import the Postman collection: `docs/api/postman-collection.json`
2. Set environment variables:
   - `baseUrl`: `http://localhost:3000/api/v1`
   - `accessToken`: (auto-set after login)
   - `refreshToken`: (auto-set after login)
3. Run requests in order:
   - Register → Login → Protected endpoints

---

## 📚 Additional Resources

- **Swagger UI**: http://localhost:3000/docs
- **OpenAPI Spec**: `docs/api/openapi.yaml`
- **Postman Collection**: `docs/api/postman-collection.json`

---

**Happy Testing! 🚀**
