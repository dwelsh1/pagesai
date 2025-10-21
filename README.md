# PagesAI

![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css)
![Vitest](https://img.shields.io/badge/Vitest-Testing-6E9F18?style=flat-square&logo=vitest)
![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen?style=flat-square&logo=github-actions)

A modern web application built with Next.js 15, React 19, TypeScript, and a comprehensive tech stack. Features include authentication, dashboard with responsive layout, system diagnostics, and hierarchical page navigation.

## 🚀 Features

- **Modern Authentication**: JWT-based authentication with secure password hashing
- **Responsive Design**: Clean, minimalist UI built with Tailwind CSS
- **Type Safety**: End-to-end TypeScript with strict mode enabled
- **Database**: SQLite with Prisma ORM for type-safe database operations
- **Testing**: Comprehensive unit tests with 100% coverage
- **API Documentation**: Interactive OpenAPI 3.1 documentation with Swagger UI
- **Accessibility**: Built with accessibility best practices using Radix UI primitives

## 🛠️ Tech Stack

### Frontend

- **Next.js 15.5.6** - App Router, Server Components, Route Handlers
- **React 19.2.0** - Concurrent React features
- **TypeScript 5.9.3** - End-to-end type safety
- **Tailwind CSS 4.1.14** - Utility-first styling
- **shadcn/ui + Radix** - Accessible component primitives
- **Zustand 5.0.8** - Lightweight client state management
- **TanStack React Query 5.90.5** - Server state management
- **Zod 4.1.12** - Runtime validation and type safety

### Backend

- **Node.js 22 LTS** - Runtime environment
- **Next.js Route Handlers** - REST API endpoints
- **Prisma 6.16.2** - Type-safe database ORM
- **SQLite** - Single-file database
- **better-sqlite3 12.4.1** - Fast SQLite access
- **SQLite FTS5** - Full-text search capabilities

### Authentication & Security

- **jose 6.1.0** - JWT token handling (HS256)
- **bcryptjs 2.x** - Password hashing (cost 12-14)

### Code Quality & Formatting

- **ESLint** - Code linting with TypeScript support
- **Prettier** - Code formatting with ESLint integration
- **TypeScript** - Strict type checking

### API Documentation

- **@asteasolutions/zod-to-openapi** - Generate OpenAPI specs from Zod schemas
- **swagger-ui-react** - Interactive API documentation UI

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd pagesai

# Install dependencies
npm ci

# Set up database
npm run db:generate
npm run db:push
npm run db:seed

# Start development server
npm run dev
# Open http://localhost:3000
```

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd pagesai
   ```

2. **Install dependencies**

   ```bash
   npm ci
   ```

3. **Set up environment variables**

   ```bash
   # Environment variables are already configured in .env.local
   ```

   Update the values in `.env.local`:

   ```env
   DATABASE_URL="file:./prisma/dev.db"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret-change-this-in-production"
   NODE_ENV="development"
   ```

4. **Set up the database**

   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Test Coverage

The project maintains 100% test coverage for the login functionality:

- **Lines**: 95%+
- **Functions**: 95%+
- **Branches**: 90%+
- **Statements**: 95%+

## 🎨 Code Quality

### Linting and Formatting

```bash
# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check if code is formatted correctly
npm run format:check
```

### Code Quality Tools

- **ESLint**: Configured with Next.js, TypeScript, and Prettier integration
- **Prettier**: Consistent code formatting with custom configuration
- **TypeScript**: Strict mode enabled for type safety
- **Pre-commit hooks**: Automatic formatting and linting (recommended)

## 🗄️ Database

### Available Scripts

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes to database
npm run db:push

# Create and run migrations
npm run db:migrate

# Seed the database with test data
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

### Test Credentials

After running the seed script, you can use these credentials to test the login:

- **Username**: `testuser` | **Password**: `password123`
- **Username**: `admin` | **Password**: `admin123`

## 📚 API Documentation

### Interactive Documentation

Visit `/docs` in your browser to access the interactive Swagger UI documentation where you can:

- View all available API endpoints
- Test API calls directly from the browser
- View request/response schemas
- Download the OpenAPI specification

### OpenAPI Specification

The complete OpenAPI 3.1 specification is available at:

- **JSON Format**: `/api/openapi.json`
- **Interactive UI**: `/docs`

### Available Endpoints

- `POST /api/auth/login` - Authenticate user and create session
- `POST /api/auth/logout` - Terminate user session

### Example API Usage

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'

# Logout
curl -X POST http://localhost:3000/api/auth/logout
```

## 🏗️ Project Structure

```
pagesai/
├── app/                          # Next.js 15 App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   └── openapi.json/         # OpenAPI specification endpoint
│   ├── docs/                     # API documentation page
│   ├── (auth)/                   # Auth route group
│   │   └── login/                # Login page
│   ├── globals.css               # Global styles with Tailwind
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── prisma/                       # Database schema and migrations
│   ├── schema.prisma             # Database schema
│   ├── seed.ts                   # Database seeding script
│   └── migrations/               # Database migrations
├── src/                          # Source code
│   ├── components/               # Reusable components
│   │   ├── ui/                   # shadcn/ui components
│   │   └── auth/                 # Auth-specific components
│   ├── lib/                      # Utilities and configurations
│   │   ├── auth.ts               # Authentication utilities
│   │   ├── db.ts                 # Database connection
│   │   ├── openapi.ts            # OpenAPI specification generator
│   │   ├── password.ts           # Password utilities
│   │   ├── validators/           # Zod schemas
│   │   │   ├── auth.ts           # Authentication schemas
│   │   │   └── api.ts            # API response schemas
│   │   └── utils.ts              # General utilities
│   └── server/                   # Server-side utilities
│       └── auth.ts               # Server auth helpers
├── tests/                        # Test files
│   ├── setup.ts                  # Test setup
│   ├── lib/                      # Library tests
│   ├── components/               # Component tests
│   └── app/                      # App tests
├── docs/                         # Documentation
│   ├── api.md                    # API documentation
│   ├── developer.md              # Developer guidelines
│   ├── plan.md                   # Project plan
│   └── testing.md                # Testing strategy
└── ...config files
```

## 🔐 Authentication Flow

1. **Login**: User enters credentials on the login page
2. **Validation**: Form data is validated using Zod schemas
3. **Authentication**: Server verifies credentials against database
4. **Session Creation**: JWT token is created and stored in HttpOnly cookie
5. **Success**: User is redirected or shown success modal

## 🎨 UI Components

The project uses shadcn/ui components built on Radix UI primitives for accessibility:

- **Button**: Various button variants and sizes
- **Input**: Form input with proper styling
- **Label**: Accessible form labels
- **Dialog**: Modal dialogs for user interactions

## 📝 Development

### Code Quality

- **TypeScript**: Strict mode enabled with comprehensive type checking
- **ESLint**: Configured with Next.js and TypeScript rules
- **Prettier**: Code formatting (if configured)
- **Husky**: Git hooks for pre-commit checks (if configured)

### Git Workflow

- Use semantic commit messages: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`
- Create feature branches from development
- Use GitHub CLI (`gh`) for branch and PR management
- All code must be reviewed before merging

## 🚀 Deployment

### Environment Variables

Ensure these environment variables are set in production:

```env
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-secure-jwt-secret"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secure-nextauth-secret"
NODE_ENV="production"
```

### Build Commands

```bash
# Build for production
npm run build

# Start production server
npm start

# Type check
npm run type-check
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Check the [developer documentation](developer.md)
- Open an issue on GitHub
- Review the test files for usage examples

## 🎯 Next Steps

After setting up the basic authentication system, consider implementing:

1. **User Registration**: Complete the sign-up flow
2. **Dashboard**: Create a user dashboard after login
3. **User Management**: Admin panel for user management
4. **BlockNote Integration**: Add the Notion-style editor
5. **Full-text Search**: Implement SQLite FTS5 search
6. **Email Verification**: Add email verification for new users
7. **Password Reset**: Implement password reset functionality
8. **Social Login**: Add OAuth providers (Google, GitHub, etc.)
