# Changelog

All notable changes to PagesAI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [v0.4.0] - 2025-01-19

### Added
- **Complete TipTap Floating Toolbar Implementation**
- 18 fully functional toolbar buttons with proper positioning
- Text formatting: Bold, Italic, Underline, Code
- Structure elements: Headings (H1-H3), Paragraph, Lists, Blockquote
- Text alignment: Left, Center, Right, Justify (all working!)
- Link and Image functionality with custom modals
- File explorer support for image uploads
- Custom styled modals replacing browser prompts
- Responsive toolbar positioning for all screen sizes
- Comprehensive CSS overrides for proper text alignment

### Fixed
- TextStyle import errors and duplicate extension warnings
- Toolbar cut-off issues across all screen sizes
- Floating toolbar positioning for all alignments
- Proper bounds checking for all viewport sizes
- Text alignment rendering issues

### Changed
- Replaced browser native prompts with styled custom modals
- Enhanced editor functionality with rich text capabilities
- Improved user experience with professional toolbar interface

## [0.3.0] - 2024-12-19

### Added

- **TipTap Rich Text Editor Integration**:
  - Replaced BlockNote with TipTap for better React 19 compatibility
  - Live editing with auto-save functionality (debounced every 2 seconds)
  - Clean, borderless editor that fills entire content area
  - Custom CSS styling to remove default editor boxes and borders
  - Proper padding (1.5rem) around content for better readability
  - HTML content rendering from BlockNote JSON format
  - Seamless integration with existing page management system

- **Enhanced Global Header**:
  - Functional search bar with real-time page search
  - Search results dropdown with click-to-navigate functionality
  - Dynamic breadcrumbs showing current page title
  - User dropdown menu with username and signout option
  - Settings gear icon for future configuration
  - Proper breadcrumb positioning (ml-3 spacing from search box)
  - Click-outside handlers for dropdowns

- **Simplified Page Creation**:
  - Streamlined "Create New Page" form with only title input
  - Save/Cancel buttons with proper validation
  - Automatic navigation to created page after saving
  - Clean, minimal UI without complex editor during creation

- **System Diagnostics Page**:
  - Comprehensive system health monitoring
  - Real-time console log capture (every 1 second updates)
  - Performance metrics display
  - Quick actions: Clear Auth, Reset Data, Reload App
  - Export functionality for diagnostics and logs
  - Fixed infinite loop issues with console log capturing
  - Proper modal dialogs for destructive actions

- **Search Functionality**:
  - Full-text search across page titles, content, and descriptions
  - Case-sensitive search (SQLite compatible)
  - Real-time search with 300ms debouncing
  - Search results limited to 20 pages, ordered by update time
  - Proper authentication scoping for search results

- **UI/UX Improvements**:
  - Removed sidebar search bar (kept global header search)
  - Clean white background throughout application
  - Removed internal page headers (integrated with global header)
  - Proper spacing and padding around content
  - Responsive design improvements
  - Tooltips on all interactive elements

### Changed

- **Editor System**:
  - Migrated from BlockNote to TipTap for better stability
  - Removed BlockNote dependencies and installed TipTap packages
  - Updated editor styling to be completely transparent and borderless
  - Added proper content padding for better readability

- **Page Management**:
  - Simplified page creation workflow
  - Enhanced page viewing with live editing capabilities
  - Improved auto-save with better debouncing
  - Better error handling and user feedback

- **Navigation**:
  - Enhanced global header with search and breadcrumbs
  - Improved sidebar layout and organization
  - Better page navigation and state management
  - Dynamic page title display in breadcrumbs

### Fixed

- **Authentication Issues**:
  - Fixed 401 Unauthorized errors in page content fetching
  - Added `credentials: 'include'` to all client-side API calls
  - Proper session management across page navigation

- **Editor Issues**:
  - Fixed TipTap SSR hydration errors
  - Resolved editor loading states and content rendering
  - Fixed raw JSON display issues
  - Eliminated editor box styling conflicts

- **Search Issues**:
  - Fixed SQLite `mode: 'insensitive'` compatibility error
  - Resolved search result navigation problems
  - Fixed form submission interference with search clicks
  - Improved click-outside handler for search dropdown

- **UI Issues**:
  - Fixed breadcrumb positioning and text wrapping
  - Resolved header layout and syntax errors
  - Fixed user dropdown implementation
  - Corrected spacing and alignment issues

- **Diagnostics Issues**:
  - Fixed infinite loop in console log capturing
  - Resolved "Maximum update depth exceeded" errors
  - Improved log update mechanism with periodic updates
  - Better error handling and state management

### Technical Improvements

- **Environment Configuration**:
  - Proper `.env` and `.env.local` file management
  - Fixed Prisma Studio DATABASE_URL environment variable issues
  - Better environment variable handling for development

- **Code Quality**:
  - Removed debugging logs and optimized component re-renders
  - Better error handling and user feedback
  - Improved TypeScript types and validation
  - Enhanced component isolation and testing

- **Phase 3: Rich Text Editor Integration**:
  - BlockNote editor integration with Notion-style editing experience
  - Complete page creation workflow (`/dashboard/page/create`)
  - Page editing interface (`/dashboard/page/[id]/edit`)
  - Page viewing interface (`/dashboard/page/[id]`)
  - Auto-save functionality (every 30 seconds)
  - Page metadata management (title, description, tags)
  - Hierarchical page structure support
  - Content persistence with Prisma/SQLite database
  - Rich formatting tools: bold, italic, headers, lists, code blocks
  - Custom toolbar components with Tailwind styling
  - Mobile-responsive editing experience
  - Unsaved changes indicator
  - Confirmation dialogs for unsaved changes

- **Page Management API**:
  - `GET /api/pages` - List all pages for authenticated user
  - `POST /api/pages` - Create new page
  - `GET /api/pages/[id]` - Get specific page
  - `PUT /api/pages/[id]` - Update existing page
  - `DELETE /api/pages/[id]` - Delete page
  - Full CRUD operations with authentication
  - Zod validation for all inputs and responses
  - Proper error handling and status codes
  - Hierarchical page relationships support

- **Database Schema Updates**:
  - Added `Page` model with comprehensive fields
  - Content stored as JSON for BlockNote compatibility
  - User ownership with cascade deletion
  - Hierarchical relationships (parent/children)
  - Timestamps and metadata fields
  - Tags support for page categorization

- **UI Components**:
  - `PageEditor`: Full-featured editing interface
  - `PageViewer`: Read-only page display with metadata
  - Integrated with existing MainLayout system
  - Responsive design with Tailwind CSS
  - Accessibility features maintained
  - Loading states and error handling
  - Back navigation and edit buttons

- **Testing Coverage**:
  - Comprehensive unit tests for editor components
  - API endpoint tests with authentication mocking
  - Component interaction testing
  - Error handling validation
  - Mock implementations for BlockNote components

- **Phase 2: Core Layout & Navigation**:
  - Comprehensive layout system with Header, Sidebar, and MainLayout components
  - Responsive dashboard with mobile-friendly navigation
  - Hierarchical page navigation with expand/collapse functionality
  - Dashboard page with stats cards, recent pages, and quick start guide
  - Search functionality in header and sidebar
  - User menu with settings and logout options
  - Context menus for page management (edit, delete)
  - MainLayout component for consistent page structure
  - Header component with logo, search bar, and user actions
  - Sidebar component with page tree navigation and quick actions
  - Dashboard page with welcome section, stats, and recent activity
  - Back button integration in Diagnostics page for seamless navigation
  - Single-user optimized UI (removed collaboration features)
  - Direct login redirect to dashboard (removed success modal)

- **Authentication Hook**:
  - `useAuth` hook for client-side authentication state management
  - Automatic authentication status checking
  - Login, logout, and registration functions
  - Proper error handling and loading states
  - Integration with existing authentication system

- **System Diagnostics Page**:
  - Comprehensive system monitoring and debugging tool
  - Real-time system status display (server, API, online status)
  - Package version tracking for all dependencies
  - Performance metrics (uptime, memory usage, CPU usage)
  - Console log capture and display functionality
  - Quick Actions: Clear Auth, Reset Data, Reload App, Simulate Error
  - Export functionality for diagnostics reports and console logs
  - Error injection capabilities for testing error handling
  - Proper confirmation modals for destructive actions
  - Light theme styling with consistent UI components
  - Tooltips on all interactive elements for better UX

- **API Endpoints**:
  - `/api/diagnostics` - Returns comprehensive system information
  - Proper error handling and response formatting

- **UI Components**:
  - Card component for structured content display
  - Badge component for status indicators
  - Separator component for visual division
  - Enhanced Button component with cursor pointer styling

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
