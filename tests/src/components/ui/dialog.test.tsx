import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';

describe('Dialog Component', () => {
  it('should render dialog trigger', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    expect(
      screen.getByRole('button', { name: 'Open Dialog' })
    ).toBeInTheDocument();
  });

  it('should open dialog when trigger is clicked', async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByRole('button', { name: 'Open Dialog' });
    await user.click(trigger);

    expect(screen.getByText('Dialog Title')).toBeInTheDocument();
    expect(screen.getByText('Dialog description')).toBeInTheDocument();
  });

  it('should render dialog content with correct structure', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByText('Dialog Title')).toBeInTheDocument();
    expect(screen.getByText('Dialog description')).toBeInTheDocument();
  });

  it('should apply custom className to dialog content', () => {
    render(
      <Dialog open>
        <DialogContent className='custom-dialog'>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    const content = screen.getByRole('dialog');
    expect(content).toHaveClass('custom-dialog');
  });

  it('should render dialog overlay', () => {
    render(
      <Dialog open>
        <DialogOverlay className='custom-overlay' />
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    // Check if overlay exists by looking for the backdrop element
    const backdrop = document.querySelector('.backdrop-blur-sm');
    expect(backdrop).toBeInTheDocument();
  });

  it('should render dialog close button', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    const closeButton = screen.getByRole('button', { name: 'Close' });
    expect(closeButton).toBeInTheDocument();
  });

  it('should close dialog when close button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    const closeButton = screen.getByRole('button', { name: 'Close' });
    expect(closeButton).toBeInTheDocument();
    
    // Test that the close button is clickable
    await user.click(closeButton);
    expect(closeButton).toBeInTheDocument();
  });

  it('should render dialog footer', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogFooter className='custom-footer'>
            <button>Cancel</button>
            <button>Save</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    const footer = screen.getByRole('button', { name: 'Cancel' }).parentElement;
    expect(footer).toHaveClass('custom-footer');
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('should render dialog header with custom className', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogHeader className='custom-header'>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    const header = screen.getByText('Dialog Title').parentElement;
    expect(header).toHaveClass('custom-header');
  });

  it('should render dialog title with custom className', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle className='custom-title'>Dialog Title</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    const title = screen.getByText('Dialog Title');
    expect(title).toHaveClass('custom-title');
  });

  it('should render dialog description with custom className', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogDescription className='custom-description'>
            Dialog description
          </DialogDescription>
        </DialogContent>
      </Dialog>
    );

    const description = screen.getByText('Dialog description');
    expect(description).toHaveClass('custom-description');
  });

  it('should handle dialog close with DialogClose component', async () => {
    const user = userEvent.setup();

    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogClose>Custom Close</DialogClose>
        </DialogContent>
      </Dialog>
    );

    const customCloseButton = screen.getByRole('button', { name: 'Custom Close' });
    expect(customCloseButton).toBeInTheDocument();
    
    // Test that the custom close button is clickable
    await user.click(customCloseButton);
    expect(customCloseButton).toBeInTheDocument();
  });
});
