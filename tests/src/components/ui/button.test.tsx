import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('should render button with children', () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole('button', { name: 'Click me' })
    ).toBeInTheDocument();
  });

  it('should handle click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button', { name: 'Click me' });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled button</Button>);
    expect(
      screen.getByRole('button', { name: 'Disabled button' })
    ).toBeDisabled();
  });

  it('should render as child when asChild is true', () => {
    render(
      <Button asChild>
        <a href='/test'>Link button</a>
      </Button>
    );
    expect(
      screen.getByRole('link', { name: 'Link button' })
    ).toBeInTheDocument();
  });

  it('should apply variant classes', () => {
    render(<Button variant='destructive'>Destructive button</Button>);
    const button = screen.getByRole('button', { name: 'Destructive button' });
    expect(button).toHaveClass('bg-destructive');
  });

  it('should apply size classes', () => {
    render(<Button size='sm'>Small button</Button>);
    const button = screen.getByRole('button', { name: 'Small button' });
    expect(button).toHaveClass('h-9');
  });
});
