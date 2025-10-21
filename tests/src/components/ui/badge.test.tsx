import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/ui/badge';

describe('Badge Component', () => {
  it('should render Badge with default variant', () => {
    render(<Badge>Default Badge</Badge>);
    
    expect(screen.getByText('Default Badge')).toBeInTheDocument();
  });

  it('should render Badge with secondary variant', () => {
    render(<Badge variant="secondary">Secondary Badge</Badge>);
    
    expect(screen.getByText('Secondary Badge')).toBeInTheDocument();
  });

  it('should render Badge with destructive variant', () => {
    render(<Badge variant="destructive">Destructive Badge</Badge>);
    
    expect(screen.getByText('Destructive Badge')).toBeInTheDocument();
  });

  it('should render Badge with outline variant', () => {
    render(<Badge variant="outline">Outline Badge</Badge>);
    
    expect(screen.getByText('Outline Badge')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<Badge className="custom-badge">Custom Badge</Badge>);
    
    const badge = screen.getByText('Custom Badge');
    expect(badge).toHaveClass('custom-badge');
  });

  it('should render Badge with different sizes', () => {
    render(
      <div>
        <Badge>Default Size</Badge>
        <Badge className="text-xs">Small Size</Badge>
        <Badge className="text-lg">Large Size</Badge>
      </div>
    );

    expect(screen.getByText('Default Size')).toBeInTheDocument();
    expect(screen.getByText('Small Size')).toBeInTheDocument();
    expect(screen.getByText('Large Size')).toBeInTheDocument();
  });

  it('should render Badge with status indicators', () => {
    render(
      <div className="space-x-2">
        <Badge variant="default">Active</Badge>
        <Badge variant="secondary">Inactive</Badge>
        <Badge variant="destructive">Error</Badge>
        <Badge variant="outline">Pending</Badge>
      </div>
    );

    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });
});
