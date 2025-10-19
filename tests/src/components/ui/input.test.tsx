import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '@/components/ui/input';

describe('Input Component', () => {
  it('should render input with placeholder', () => {
    render(<Input placeholder='Enter text' />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('should handle value changes', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'test');

    expect(handleChange).toHaveBeenCalled();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('should render with correct type', () => {
    render(<Input type='password' />);
    expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password');
  });

  it('should render with id', () => {
    render(<Input id='test-input' />);
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'test-input');
  });

  it('should render with className', () => {
    render(<Input className='custom-class' />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
  });
});
