import { useState, useRef, useEffect } from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';

type Option = {
  label: string;
  value: string;
};

type SelectProps<T extends FieldValues> = {
    name: Path<T>;
    control: Control<T>;
    options: Option[];
    multiple?: boolean;
    placeholder?: string;
  };
  
  const Select = <T extends FieldValues>({
  options,
  multiple = false,
  placeholder = 'Select...',
  control,
  name,
}: SelectProps<T>) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control });

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (selectedValue: string) => {
    if (multiple) {
      const newValues = value?.includes(selectedValue)
        ? value.filter((v: string) => v !== selectedValue)
        : [...(value || []), selectedValue];
      onChange(newValues);
    } else {
      onChange(selectedValue);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-left shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <span>
          {multiple
            ? value?.map((val: string) => options.find((o) => o.value === val)?.label).join(', ') ||
              placeholder
            : options.find((o) => o.value === value)?.label || placeholder}
        </span>
        <span className="ml-2 text-gray-500">▼</span>
      </button>

      {isOpen && (
        <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
          {options.map((option) => (
            <li
              key={option.value}
              className={`flex cursor-pointer items-center px-4 py-2 gap-2 ${
                multiple && value?.includes(option.value) ? 'bg-blue-200' : ''
              }`}
              onClick={() => handleSelect(option.value)}
            >
              {multiple && (
                <input
                  type="checkbox"
                  checked={value?.includes(option.value)}
                  onChange={() => handleSelect(option.value)}
                />
              )}
              {option.label}
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default Select;
