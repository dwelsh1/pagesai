import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import APIDocsPage from '../../../app/docs/page';

// Mock SwaggerUI
vi.mock('swagger-ui-react', () => ({
  default: vi.fn(({ spec }) => (
    <div data-testid='swagger-ui' data-spec={JSON.stringify(spec)}>
      Swagger UI Component
    </div>
  )),
}));

// Mock CSS import
vi.mock('swagger-ui-react/swagger-ui.css', () => ({}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('API Docs Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockClear();
  });

  it('should show loading state initially', () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<APIDocsPage />);

    expect(screen.getByText('Loading API documentation...')).toBeInTheDocument();
    expect(screen.getByText('Loading API documentation...').closest('div')).toBeInTheDocument();
  });

  it('should render API documentation when spec loads successfully', async () => {
    const mockSpec = {
      openapi: '3.1.0',
      info: { title: 'PagesAI API', version: '1.0.0' },
      paths: {},
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockSpec,
    });

    render(<APIDocsPage />);

    await waitFor(() => {
      expect(screen.getByText('PagesAI API Documentation')).toBeInTheDocument();
    });

    expect(screen.getByText('Interactive API documentation for PagesAI authentication endpoints')).toBeInTheDocument();
    expect(screen.getByTestId('swagger-ui')).toBeInTheDocument();
  });

  it('should show error state when fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<APIDocsPage />);

    await waitFor(() => {
      expect(screen.getByText('Error Loading Documentation')).toBeInTheDocument();
    });

    expect(screen.getByText('Network error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('should show error state when response is not ok', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<APIDocsPage />);

    await waitFor(() => {
      expect(screen.getByText('Error Loading Documentation')).toBeInTheDocument();
    });

    expect(screen.getByText('Failed to fetch API specification')).toBeInTheDocument();
  });

  it('should handle non-Error exceptions', async () => {
    mockFetch.mockRejectedValueOnce('String error');

    render(<APIDocsPage />);

    await waitFor(() => {
      expect(screen.getByText('Error Loading Documentation')).toBeInTheDocument();
    });

    expect(screen.getByText('Unknown error')).toBeInTheDocument();
  });
});
