import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

describe('Card Component', () => {
  it('should render Card with content', () => {
    render(
      <Card>
        <CardContent>
          <p>Card content</p>
        </CardContent>
      </Card>
    );

    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('should render Card with header', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card content</p>
        </CardContent>
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card description')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('should render Card with footer', () => {
    render(
      <Card>
        <CardContent>
          <p>Card content</p>
        </CardContent>
        <CardFooter>
          <p>Card footer</p>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText('Card content')).toBeInTheDocument();
    expect(screen.getByText('Card footer')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(
      <Card className="custom-class">
        <CardContent>
          <p>Card content</p>
        </CardContent>
      </Card>
    );

    const card = screen.getByText('Card content').closest('div')?.parentElement;
    expect(card).toHaveClass('custom-class');
  });

  it('should render complete Card structure', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
          <CardDescription>This is a test card</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is the main content of the card.</p>
        </CardContent>
        <CardFooter>
          <p>This is the footer content.</p>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('This is a test card')).toBeInTheDocument();
    expect(screen.getByText('This is the main content of the card.')).toBeInTheDocument();
    expect(screen.getByText('This is the footer content.')).toBeInTheDocument();
  });
});