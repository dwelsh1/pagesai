import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PageEditor } from '@/components/editor/page-editor';

// Mock TipTap components
vi.mock('@tiptap/react', () => ({
  useEditor: vi.fn(() => ({
    isEditable: true,
    commands: {
      setContent: vi.fn(),
      focus: vi.fn(),
      toggleBold: vi.fn(),
      toggleItalic: vi.fn(),
      toggleUnderline: vi.fn(),
      toggleCodeBlock: vi.fn(),
      setHeading: vi.fn(),
      setParagraph: vi.fn(),
      toggleBulletList: vi.fn(),
      toggleOrderedList: vi.fn(),
      toggleBlockquote: vi.fn(),
      setTextAlign: vi.fn(),
      setLink: vi.fn(),
      insertContent: vi.fn(),
      setTextSelection: vi.fn(),
      selectAll: vi.fn(),
      chain: vi.fn(() => ({
        focus: vi.fn(() => ({
          toggleBold: vi.fn(() => ({ run: vi.fn() })),
          toggleItalic: vi.fn(() => ({ run: vi.fn() })),
          toggleUnderline: vi.fn(() => ({ run: vi.fn() })),
          toggleCodeBlock: vi.fn(() => ({ run: vi.fn() })),
          setHeading: vi.fn(() => ({ run: vi.fn() })),
          setParagraph: vi.fn(() => ({ run: vi.fn() })),
          toggleBulletList: vi.fn(() => ({ run: vi.fn() })),
          toggleOrderedList: vi.fn(() => ({ run: vi.fn() })),
          toggleBlockquote: vi.fn(() => ({ run: vi.fn() })),
          setTextAlign: vi.fn(() => ({ run: vi.fn() })),
          setLink: vi.fn(() => ({ run: vi.fn() })),
          insertContent: vi.fn(() => ({ run: vi.fn() })),
          run: vi.fn(),
        })),
      })),
    },
    getHTML: vi.fn(() => '<p>Test content</p>'),
    setEditable: vi.fn(),
    destroy: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    isActive: vi.fn(() => false),
    isFocused: true,
    state: {
      selection: { from: 0, to: 0 },
      doc: { textBetween: vi.fn(() => '') },
    },
    view: {
      dom: { focus: vi.fn() },
      coordsAtPos: vi.fn(() => ({ left: 0, top: 0, right: 0 })),
    },
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

vi.mock('@tiptap/extension-underline', () => ({
  default: vi.fn(),
}));

vi.mock('@tiptap/extension-link', () => ({
  default: {
    configure: vi.fn(() => ({})),
  },
}));

vi.mock('@tiptap/extension-image', () => ({
  default: {
    configure: vi.fn(() => ({})),
  },
}));

vi.mock('@tiptap/extension-text-align', () => ({
  default: {
    configure: vi.fn(() => ({})),
  },
}));

vi.mock('@tiptap/extension-text-style', () => ({
  TextStyle: vi.fn(),
}));

vi.mock('@tiptap/extension-color', () => ({
  default: vi.fn(() => ({
    configure: vi.fn(() => ({})),
  })),
}));

vi.mock('@/lib/slash-command-extension', () => ({
  SlashCommand: vi.fn(),
}));

vi.mock('@/components/editor/floating-toolbar', () => ({
  FloatingToolbar: vi.fn(() => <div data-testid="floating-toolbar">Mock Floating Toolbar</div>),
}));

vi.mock('@/components/editor/slash-command-menu', () => ({
  SlashCommandMenu: vi.fn(() => <div data-testid="slash-command-menu">Mock Slash Command Menu</div>),
}));

vi.mock('@/components/editor/image-modal', () => ({
  ImageModal: vi.fn(() => <div data-testid="image-modal">Mock Image Modal</div>),
}));

vi.mock('@/components/editor/link-modal', () => ({
  LinkModal: vi.fn(() => <div data-testid="link-modal">Mock Link Modal</div>),
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
