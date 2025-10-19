# Testing Strategy for PagesAI

## Overview

This document outlines the comprehensive testing strategy for PagesAI, a Next.js 15 application with React 19, TypeScript, Prisma, and SQLite. Our testing approach prioritizes reliability, maintainability, and developer productivity.

## Testing Philosophy

### Core Principles

1. **Test What Matters**: Focus on business logic, user interactions, and critical paths
2. **Maintainable Tests**: Write tests that are easy to understand and modify
3. **Fast Feedback**: Provide quick feedback during development
4. **Realistic Testing**: Test components in conditions similar to production

### Testing Pyramid

```
    /\
   /  \     E2E Tests (Playwright) - Few, Critical User Journeys
  /____\
 /      \   Integration Tests (Vitest) - API Routes, Database Operations
/________\
/          \ Unit Tests (Vitest) - Pure Functions, Components, Utilities
/__________\
```

## Testing Stack

### Primary Testing Framework

- **Vitest**: Fast, Vite-native testing framework
- **@testing-library/react**: React component testing utilities
- **@testing-library/user-event**: User interaction simulation
- **jsdom**: DOM environment for testing

### Coverage Tools

- **v8**: Coverage provider for detailed metrics
- **Coverage Thresholds**: 95% lines/functions/statements, 90% branches

### Mocking Strategy

- **MSW (Mock Service Worker)**: API request mocking
- **Vitest mocks**: Module and function mocking
- **Database**: Temporary SQLite files for integration tests

## Test Organization

### Directory Structure

```
tests/
├── setup.ts                 # Global test setup
├── lib/                     # Unit tests for utilities
│   ├── password.test.ts
│   ├── auth.test.ts
│   ├── db.test.ts
│   └── validators/
│       └── auth.test.ts
├── components/              # Component tests
│   ├── auth/
│   │   └── login-form.test.tsx
│   └── ui/
│       ├── button.test.tsx
│       ├── input.test.tsx
│       ├── label.test.tsx
│       └── dialog.test.tsx
├── app/                     # Page and API route tests
│   ├── login-page.test.tsx
│   ├── layout.test.tsx
│   ├── page.test.tsx
│   └── api/
│       └── auth/
│           ├── login/
│           │   └── route.test.ts
│           └── logout/
│               └── route.test.ts
└── server/                  # Server-side function tests
    └── auth.test.ts
```

## Testing Categories

### 1. Unit Tests

**Purpose**: Test individual functions and components in isolation

**What to Test**:

- Pure functions (password hashing, validation)
- Utility functions (auth helpers, database utilities)
- Component rendering and basic interactions
- Error handling and edge cases

**Example**:

```typescript
describe('Password Utilities', () => {
  it('should hash a password with correct cost factor', async () => {
    const mockHash = 'hashed_password_123';
    vi.mocked(bcrypt.hash).mockResolvedValue(mockHash as never);

    const result = await hashPassword('testpassword');

    expect(bcrypt.hash).toHaveBeenCalledWith('testpassword', 12);
    expect(result).toBe(mockHash);
  });
});
```

### 2. Integration Tests

**Purpose**: Test how different parts of the system work together

**What to Test**:

- API route handlers with real database operations
- Database queries and transactions
- Authentication flows
- Error propagation through layers

**Example**:

```typescript
describe('Login API Route', () => {
  it('should authenticate user and create session', async () => {
    const mockUser = { id: 'user123', username: 'testuser' };
    vi.mocked(authenticateUser).mockResolvedValue(mockUser);
    vi.mocked(createSession).mockResolvedValue(undefined);

    const request = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'testuser', password: 'password123' }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(authenticateUser).toHaveBeenCalledWith('testuser', 'password123');
  });
});
```

### 3. Component Tests

**Purpose**: Test React components in realistic user scenarios

**What to Test**:

- Component rendering with different props
- User interactions (clicks, form submissions, navigation)
- State changes and side effects
- Error states and loading states
- Accessibility features

**Example**:

```typescript
describe('LoginForm', () => {
  it('should handle successful login', async () => {
    const user = userEvent.setup()
    const mockResponse = { ok: true, json: () => Promise.resolve({ success: true }) }
    vi.mocked(fetch).mockResolvedValue(mockResponse as Response)

    render(<LoginForm />)

    await user.type(screen.getByTestId('username-input'), 'testuser')
    await user.type(screen.getByTestId('password-input'), 'password123')
    await user.click(screen.getByTestId('sign-in-button'))

    await waitFor(() => {
      expect(screen.getByText('Login Successful!')).toBeInTheDocument()
    })
  })
})
```

## Mocking Strategy

### External Dependencies

**Database (Prisma)**:

```typescript
vi.mock('@/lib/db', () => ({
  db: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));
```

**Next.js APIs**:

```typescript
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

vi.mock('next/server', () => ({
  NextRequest: vi.fn(),
  NextResponse: vi.fn(),
}));
```

**External Libraries**:

```typescript
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));
```

### API Mocking with MSW

For integration tests that need realistic API behavior:

```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(ctx.json({ success: true, user: { id: '1' } }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Test Data Management

### Test Users

- **testuser** / **password123** - Standard test account
- **admin** / **admin123** - Admin test account

### Database State

- Use temporary SQLite files for integration tests
- Reset database state between tests
- Seed test data as needed

## Coverage Strategy

### Coverage Targets

- **Lines**: 95%
- **Functions**: 95%
- **Branches**: 90%
- **Statements**: 95%

### What to Exclude

- Configuration files
- Build artifacts
- Test files themselves
- Type definition files
- Prisma schema files

### Coverage Reports

```bash
npm run test:coverage
```

Generates:

- Text summary in terminal
- HTML report in `coverage/` directory
- JSON report for CI/CD integration

## Running Tests

### Development Workflow

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### CI/CD Integration

```bash
# Run tests in CI
npm run test:coverage
```

## Best Practices

### Writing Tests

1. **Descriptive Names**: Use clear, descriptive test names
2. **Arrange-Act-Assert**: Structure tests clearly
3. **Single Responsibility**: One assertion per test when possible
4. **Test Data**: Use realistic test data
5. **Cleanup**: Always clean up after tests

### Test Maintenance

1. **Keep Tests Simple**: Avoid complex test logic
2. **Mock External Dependencies**: Isolate units under test
3. **Update Tests with Code**: Maintain tests alongside features
4. **Review Test Coverage**: Regularly review coverage reports

### Performance

1. **Parallel Execution**: Vitest runs tests in parallel by default
2. **Selective Testing**: Use test filters for focused testing
3. **Mock Heavy Operations**: Mock database and API calls
4. **Fast Feedback**: Keep individual tests under 100ms

## Common Patterns

### Testing Async Operations

```typescript
it('should handle async operations', async () => {
  const promise = someAsyncFunction();
  await expect(promise).resolves.toBe(expectedValue);
});
```

### Testing Error Cases

```typescript
it('should handle errors gracefully', async () => {
  vi.mocked(someFunction).mockRejectedValue(new Error('Test error'));

  await expect(asyncFunction()).rejects.toThrow('Test error');
});
```

### Testing Form Interactions

```typescript
it('should update form state', async () => {
  const user = userEvent.setup()
  render(<FormComponent />)

  await user.type(screen.getByLabelText('Username'), 'testuser')
  expect(screen.getByDisplayValue('testuser')).toBeInTheDocument()
})
```

## Troubleshooting

### Common Issues

1. **Import Resolution**: Ensure proper path aliases in `vitest.config.mjs`
2. **Mock Setup**: Verify mocks are properly configured
3. **Async Operations**: Use proper async/await patterns
4. **DOM Environment**: Ensure jsdom is properly configured

### Debugging Tests

1. **Console Logs**: Use `console.log` for debugging
2. **Test UI**: Use `npm run test:ui` for interactive debugging
3. **Coverage Reports**: Check uncovered lines in HTML report
4. **Test Isolation**: Ensure tests don't affect each other

## Future Enhancements

### Planned Improvements

1. **E2E Testing**: Add Playwright for end-to-end testing
2. **Visual Testing**: Add visual regression testing
3. **Performance Testing**: Add performance benchmarks
4. **Accessibility Testing**: Add automated a11y testing

### Monitoring

1. **Test Metrics**: Track test execution time and coverage
2. **Flaky Tests**: Identify and fix unreliable tests
3. **Test Debt**: Regular review of test quality and coverage

## Conclusion

This testing strategy provides a solid foundation for maintaining code quality and reliability in PagesAI. By following these guidelines and patterns, we ensure that our application remains robust and maintainable as it grows.

The combination of unit tests, integration tests, and component tests provides comprehensive coverage while maintaining fast feedback loops for developers. Regular review and updates to this strategy will ensure it remains effective as the project evolves.
