import { render, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  test('renders Button with text', () => {
    const { getByTestId } = render(<Button>Click Me</Button>);
    const button = getByTestId('button');
    expect(button).toBeDefined();
  });

  test('handles click event', () => {
    const handleClick = vi.fn();

    const { getByTestId } = render(<Button onClick={handleClick}>Click Me</Button>);
    const button = getByTestId('button');

    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('renders disabled Button when loading', () => {
    const { getByTestId } = render(<Button isLoading>Loading...</Button>);
    const button = getByTestId('button');

    expect(button).toBeDisabled();
  });

  test('applies correct variant classes', () => {
    const { getByTestId, rerender } = render(<Button variant="default">Default</Button>);
    const button = getByTestId('button');

    expect(button).toHaveClass('bg-blue-600');

    rerender(<Button variant="outline">Outline</Button>);
    expect(button).toHaveClass('border-gray-300');

    rerender(<Button variant="destructive">Destructive</Button>);
    expect(button).toHaveClass('bg-red-600');
  });

  test('applies correct size classes', () => {
    const { rerender, getByTestId } = render(<Button size="sm">Small</Button>);
    expect(getByTestId('button')).toHaveClass('px-3 py-1');

    rerender(<Button size="md">Medium</Button>);
    expect(getByTestId('button')).toHaveClass('px-4 py-2');

    rerender(<Button size="lg">Large</Button>);
    expect(getByTestId('button')).toHaveClass('px-6 py-3');
  });
});
