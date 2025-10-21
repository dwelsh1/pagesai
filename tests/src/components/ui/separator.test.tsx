import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Separator } from '@/components/ui/separator';

describe('Separator Component', () => {
  it('should render horizontal Separator by default', () => {
    const { container } = render(<Separator />);
    
    const separator = container.querySelector('[data-orientation="horizontal"]');
    expect(separator).toBeTruthy();
  });

  it('should render vertical Separator', () => {
    const { container } = render(<Separator orientation="vertical" />);
    
    const separator = container.querySelector('[data-orientation="vertical"]');
    expect(separator).toBeTruthy();
  });

  it('should apply custom className', () => {
    const { container } = render(<Separator className="custom-separator" />);
    
    const separator = container.querySelector('.custom-separator');
    expect(separator).toBeTruthy();
  });

  it('should render Separator with decorative prop', () => {
    const { container } = render(<Separator decorative />);
    
    const separator = container.querySelector('[aria-hidden="true"]');
    expect(separator).toBeTruthy();
  });

  it('should render Separator in layout context', () => {
    const { container } = render(
      <div className="flex flex-col space-y-4">
        <div>Content above</div>
        <Separator />
        <div>Content below</div>
      </div>
    );

    expect(screen.getByText('Content above')).toBeInTheDocument();
    expect(screen.getByText('Content below')).toBeInTheDocument();
    const separator = container.querySelector('[data-orientation="horizontal"]');
    expect(separator).toBeTruthy();
  });

  it('should render vertical Separator in flex layout', () => {
    const { container } = render(
      <div className="flex items-center space-x-4">
        <div>Left content</div>
        <Separator orientation="vertical" />
        <div>Right content</div>
      </div>
    );

    expect(screen.getByText('Left content')).toBeInTheDocument();
    expect(screen.getByText('Right content')).toBeInTheDocument();
    const separator = container.querySelector('[data-orientation="vertical"]');
    expect(separator).toBeTruthy();
  });

  it('should render Separator with proper accessibility attributes', () => {
    const { container } = render(<Separator />);
    
    const separator = container.querySelector('[data-orientation="horizontal"]') as HTMLElement;
    expect(separator).toHaveAttribute('role', 'separator');
  });

  it('should render decorative Separator without role', () => {
    const { container } = render(<Separator decorative />);
    
    const separator = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(separator).not.toHaveAttribute('role', 'separator');
  });
});
