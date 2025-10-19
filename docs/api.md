# PagesAI API Documentation

## Overview

The PagesAI API provides authentication and user management endpoints for the PagesAI application. This API is built with Next.js 15 Route Handlers and uses Zod for validation and OpenAPI 3.1 for documentation.

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://your-domain.com`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Tokens are stored in HTTP-only cookies for security.

### Session Management

- **Token Type**: JWT with HS256 algorithm
- **Expiration**: 7 days
- **Storage**: HttpOnly cookies with SameSite=Lax
- **Security**: Secure flag enabled in production

## API Endpoints

### Authentication

#### POST /api/auth/login

Authenticate a user and create a session.

**Request Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Request Schema:**

- `username` (string, required): User login identifier
- `password` (string, required): User password

**Response Codes:**

- `200` - Login successful
- `400` - Validation error or invalid credentials
- `401` - Invalid credentials
- `500` - Internal server error

**Success Response (200):**

```json
{
  "success": true,
  "user": {
    "id": "cmgw87f9j0000gd1cmd4nlkux",
    "username": "testuser",
    "email": "test@example.com",
    "createdAt": "2024-12-19T10:30:00.000Z"
  }
}
```

**Error Response (400/401):**

```json
{
  "error": "Invalid credentials"
}
```

**Example Request:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

#### POST /api/auth/logout

Terminate the current user session.

**Request Body:** None

**Response Codes:**

- `200` - Logout successful
- `500` - Internal server error

**Success Response (200):**

```json
{
  "success": true
}
```

**Error Response (500):**

```json
{
  "error": "Internal server error"
}
```

**Example Request:**

```bash
curl -X POST http://localhost:3000/api/auth/logout
```

## Data Models

### User

```typescript
interface User {
  id: string; // Unique user identifier
  username: string; // User login name
  email: string | null; // User email address (optional)
  createdAt: Date; // Account creation timestamp
}
```

### Login Request

```typescript
interface LoginRequest {
  username: string; // User login identifier
  password: string; // User password
}
```

### Login Response

```typescript
interface LoginResponse {
  success: boolean; // Indicates if login was successful
  user: User; // Authenticated user information
}
```

## Error Handling

The API uses standard HTTP status codes and returns error messages in JSON format.

### Common Error Responses

**Validation Error (400):**

```json
{
  "error": "Username is required"
}
```

**Authentication Error (401):**

```json
{
  "error": "Invalid credentials"
}
```

**Server Error (500):**

```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

Currently, no rate limiting is implemented. This will be added in future versions.

## CORS

CORS is configured to allow requests from the same origin. Cross-origin requests are not currently supported.

## Security Considerations

### Password Security

- Passwords are hashed using bcryptjs with a cost factor of 12
- Passwords are never returned in API responses
- Password validation requires minimum 6 characters for registration

### Session Security

- JWT tokens are signed with HS256 algorithm
- Tokens are stored in HttpOnly cookies
- Cookies use SameSite=Lax to prevent CSRF attacks
- Secure flag is enabled in production environments

### Input Validation

- All inputs are validated using Zod schemas
- SQL injection is prevented through Prisma ORM
- XSS protection through proper content-type headers

## Testing

### Test Credentials

The following test accounts are available for development:

- **Username**: `testuser` | **Password**: `password123`
- **Username**: `admin` | **Password**: `admin123`

### Interactive Documentation

Visit `/docs` in your browser to access the interactive Swagger UI documentation where you can:

- View all available endpoints
- Test API calls directly from the browser
- View request/response schemas
- Download the OpenAPI specification

## OpenAPI Specification

The complete OpenAPI 3.1 specification is available at:

- **JSON Format**: `/api/openapi.json`
- **Interactive UI**: `/docs`

## SDK Generation

You can generate client SDKs from the OpenAPI specification using tools like:

- [OpenAPI Generator](https://openapi-generator.tech/)
- [Swagger Codegen](https://swagger.io/tools/swagger-codegen/)
- [TypeScript OpenAPI Generator](https://github.com/ferdikoomen/openapi-typescript-codegen)

## Changelog

### v1.0.0 (2024-12-19)

- Initial API release
- Authentication endpoints (login/logout)
- JWT-based session management
- OpenAPI 3.1 documentation
- Interactive Swagger UI

## Support

For API support and questions:

- **Email**: support@pagesai.com
- **Documentation**: Visit `/docs` for interactive documentation
- **Issues**: Report issues through the project repository

## Future Enhancements

- [ ] User registration endpoint
- [ ] Password reset functionality
- [ ] User profile management
- [ ] Role-based access control
- [ ] Rate limiting implementation
- [ ] Webhook support
- [ ] API versioning
- [ ] GraphQL endpoint
- [ ] Real-time subscriptions
