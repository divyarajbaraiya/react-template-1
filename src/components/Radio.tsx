import { useController, Control, FieldValues, Path } from 'react-hook-form';
import { useEffect, useRef } from 'react';

interface RadioProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  options: string[];
  label: string;
}

const Radio = <T extends FieldValues>({ name, control, options, label }: RadioProps<T>) => {
  const {
    field: { value, onChange, ref },
  } = useController({ name, control });

  const groupRef = useRef<HTMLDivElement>(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!groupRef.current?.contains(event.target as Node)) return;

      const currentIndex = options.indexOf(value);
      let newIndex = currentIndex;

      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        newIndex = (currentIndex + 1) % options.length;
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        newIndex = (currentIndex - 1 + options.length) % options.length;
      }

      if (newIndex !== currentIndex) {
        onChange(options[newIndex]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [value, options, onChange]);

  return (
    <div
      role="radiogroup"
      aria-labelledby={`${name}-label`}
      ref={groupRef}
      className="flex flex-wrap space-x-4"
    >
      <p id={`${name}-label`} className="sr-only">
        {label}
      </p>
      {options.map((option, index) => (
        <label key={option} className="flex items-center space-x-2">
          <input
            type="radio"
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
            ref={index === 0 ? ref : undefined}
            role="radio"
            aria-checked={value === option}
            tabIndex={value === option ? 0 : -1}
            className="focus:ring-2 focus:ring-blue-500"
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
};

export default Radio;
