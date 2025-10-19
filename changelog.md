# Changelog

All notable changes to PagesAI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Code Quality & Formatting**:
  - Prettier integration with ESLint for consistent code formatting
  - Custom Prettier configuration (`.prettierrc`) with project-specific rules
  - Prettier ignore patterns (`.prettierignore`) for generated files
  - ESLint configuration (`eslint.config.js`) with Prettier integration
  - Code quality scripts: `npm run format`, `npm run format:check`, `npm run lint:fix`
  - IDE integration setup for VS Code with auto-formatting on save
  - Pre-commit hooks documentation for automatic formatting

### Changed

- **Documentation Updates**:
  - Updated `README.md` with Code Quality section and formatting commands
  - Enhanced `docs/developer.md` with comprehensive Prettier and ESLint setup
  - Updated `docs/plan.md` with new Phase 5: Code Quality & Formatting
  - Added code quality tools to tech stack documentation
- **Code Formatting**:
  - Formatted entire codebase with Prettier for consistency
  - Fixed ESLint errors: unused variables and unescaped entities
  - Updated import paths in `src/lib/openapi.ts` to correct validator locations

### Fixed

- ESLint errors for unused variables in `src/lib/auth.ts` and `src/lib/openapi.ts`
- Unescaped apostrophe in `src/components/auth/login-form.tsx`
- Import path issues in OpenAPI generator

## [0.1.0] - 2024-07-30

- Initial project scaffolding with Next.js 15 and React 19
- Authentication system with JWT and bcrypt
- SQLite database with Prisma ORM
- Login page with form validation using Zod
- Comprehensive unit test suite with Vitest
- Tailwind CSS styling with shadcn/ui components
- TypeScript configuration with strict mode
- Development environment setup with hot reloading

### Changed

- Updated Next.js configuration to use CommonJS format
- Modified database connection to use absolute paths
- Enhanced error handling in login form component
- Improved test coverage and mocking strategies

### Fixed

- Resolved Next.js configuration module loading issues
- Fixed Prisma client initialization errors
- Corrected JWT secret key handling
- Fixed favicon loading and metadata issues
- Resolved test import path issues
- Fixed Zod validation error handling

### Security

- Implemented secure password hashing with bcryptjs (cost factor 12)
- Added JWT token authentication with proper expiration
- Configured secure cookie settings for production
- Added input validation with Zod schemas

## [0.1.0] - 2024-12-19

### Added

- **Project Initialization**
  - Next.js 15.5.6 with App Router
  - React 19.2.0 with Concurrent React
  - TypeScript 5.9.3 with strict mode
  - Tailwind CSS 4.1.14 with PostCSS
  - Prisma 6.16.2 with SQLite database

- **Authentication System**
  - JWT-based session management using jose library
  - Password hashing with bcryptjs (12 rounds)
  - User authentication with username/password
  - Secure cookie handling with HttpOnly, SameSite, and Secure flags
  - Session creation, update, and deletion functions

- **Database Layer**
  - SQLite database with Prisma ORM
  - User model with id, username, password, email, timestamps
  - Database seeding with test users (testuser/admin)
  - Connection pooling and query logging

- **UI Components**
  - Login form with validation and error handling
  - Success modal for login confirmation
  - Responsive design with Tailwind CSS
  - shadcn/ui component library integration
  - Accessible form controls with proper labels

- **API Routes**
  - POST /api/auth/login - User authentication
  - POST /api/auth/logout - Session termination
  - Input validation with Zod schemas
  - Proper HTTP status codes and error responses

- **Testing Infrastructure**
  - Vitest testing framework with jsdom environment
  - Comprehensive unit test coverage (95%+ target)
  - Component testing with React Testing Library
  - API route testing with mocked dependencies
  - Password utility testing with bcrypt mocking
  - Authentication flow testing

- **Development Tools**
  - ESLint configuration for code quality
  - TypeScript strict mode with proper type checking
  - Hot reloading with Next.js development server
  - Database management with Prisma Studio
  - Test coverage reporting with v8 provider

- **Documentation**
  - README.md with project overview and setup instructions
  - developer.md with detailed development guidelines
  - testing.md with comprehensive testing strategy
  - Environment configuration with .env.local

### Technical Details

- **Frontend Stack**
  - Next.js 15.5.6 (App Router, Route Handlers, Server Components)
  - React 19.2.0 (Concurrent React, Server Components)
  - TypeScript 5.9.3 (Strict mode, type safety)
  - Tailwind CSS 4.1.14 (Utility-first styling)
  - shadcn/ui + Radix UI 1.1.x (Component library)

- **Backend Stack**
  - Node.js 22 LTS
  - Next.js Route Handlers 15.5.6
  - Prisma 6.16.2 (Database ORM)
  - SQLite (Bundled database)
  - better-sqlite3 12.4.1 (SQLite driver)

- **Authentication & Security**
  - jose 6.1.0 (JWT signing/verification HS256)
  - bcryptjs 2.x (Password hashing, cost 12-14)
  - Zod 4.1.12 (Input validation)

- **Testing Stack**
  - Vitest 2.0.3 (Testing framework)
  - @vitejs/plugin-react (React support)
  - @testing-library/react 16.0.0 (Component testing)
  - @testing-library/user-event 14.5.2 (User interaction)
  - v8 (Coverage provider)
  - jsdom (DOM environment)

### Known Issues

- Test coverage reports may show some uncovered lines in UI components
- Some Zod validation error messages may vary between test environments
- Database connection requires absolute paths for Windows compatibility

### Migration Notes

- This is the initial release, no migration required
- Ensure all environment variables are properly configured
- Run `npm run db:seed` to create test users after database setup

---

## Version History

- **0.1.0** - Initial release with authentication system and comprehensive testing

## Contributing

When making changes, please:

1. Update this changelog with your changes
2. Follow semantic versioning principles
3. Include relevant details about new features, fixes, and breaking changes
4. Test all changes thoroughly before submitting

## Future Roadmap

- [ ] User registration functionality
- [ ] Password reset feature
- [ ] User profile management
- [ ] Role-based access control
- [ ] API documentation with OpenAPI/Swagger
- [ ] End-to-end testing with Playwright
- [ ] Performance monitoring and optimization
- [ ] Production deployment configuration
