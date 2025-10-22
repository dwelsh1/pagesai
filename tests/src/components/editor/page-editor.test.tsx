import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PageEditor } from '@/components/editor/page-editor';

// Mock TipTap components
vi.mock('@tiptap/react', () => ({
  useEditor: vi.fn(() => ({
    isEditable: true,
    commands: {
      setContent: vi.fn(),
    },
    getHTML: vi.fn(() => '<p>Test content</p>'),
    setEditable: vi.fn(),
    destroy: vi.fn(),
  })),
  EditorContent: vi.fn(({ editor }) => (
    <div data-testid="tiptap-editor">Mock TipTap Editor</div>
  )),
}));

vi.mock('@tiptap/starter-kit', () => ({
  default: {
    configure: vi.fn(() => ({})),
  },
}));

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

// Mock UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/input', () => ({
  Input: ({ value, onChange, ...props }: any) => (
    <input value={value} onChange={onChange} {...props} />
  ),
}));

vi.mock('@/components/ui/label', () => ({
  Label: ({ children, ...props }: any) => (
    <label {...props}>{children}</label>
  ),
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  CardContent: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  CardHeader: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  CardTitle: ({ children, ...props }: any) => (
    <h3 {...props}>{children}</h3>
  ),
}));

describe('PageEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders create page editor by default', () => {
    render(<PageEditor />);
    
    expect(screen.getByText('Create New Page')).toBeInTheDocument();
    expect(screen.getByLabelText('Title *')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  it('renders edit page editor when isEditing is true', () => {
    render(
      <PageEditor
        isEditing={true}
        initialTitle="Test Page"
        initialDescription="Test Description"
      />
    );
    
    expect(screen.getByText('Edit Page')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Page')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
  });

  it('updates title when user types', () => {
    render(<PageEditor />);
    
    const titleInput = screen.getByLabelText('Title *');
    fireEvent.change(titleInput, { target: { value: 'New Title' } });
    
    expect(titleInput).toHaveValue('New Title');
  });

  it('updates description when user types', () => {
    render(<PageEditor />);
    
    const descriptionInput = screen.getByLabelText('Description');
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
    
    expect(descriptionInput).toHaveValue('New Description');
  });

  it('disables save button when title is empty', () => {
    render(<PageEditor />);
    
    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeDisabled();
  });

  it('enables save button when title has content', () => {
    render(<PageEditor />);
    
    const titleInput = screen.getByLabelText('Title *');
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    
    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeEnabled();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(<PageEditor onCancel={onCancel} />);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('shows loading state initially', () => {
    render(<PageEditor />);
    
    expect(screen.getByTestId('tiptap-editor')).toBeInTheDocument();
  });

  it('renders editor after loading', async () => {
    render(<PageEditor />);
    
    await waitFor(() => {
      expect(screen.getByTestId('tiptap-editor')).toBeInTheDocument();
    });
  });
});
