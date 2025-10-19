import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Label } from '@/components/ui/label';

describe('Label Component', () => {
  it('should render label with children', () => {
    render(<Label>Test Label</Label>);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('should render with htmlFor attribute', () => {
    render(<Label htmlFor='test-input'>Test Label</Label>);
    const label = screen.getByText('Test Label');
    expect(label).toHaveAttribute('for', 'test-input');
  });

  it('should render with className', () => {
    render(<Label className='custom-class'>Test Label</Label>);
    const label = screen.getByText('Test Label');
    expect(label).toHaveClass('custom-class');
  });

  it('should render as child when asChild is true', () => {
    render(
      <Label asChild>
        <span>Span Label</span>
      </Label>
    );
    expect(screen.getByText('Span Label')).toBeInTheDocument();
  });
});
