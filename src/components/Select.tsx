import { useState, useRef, useEffect } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";

type Option = {
  label: string;
  value: string;
};

interface SelectProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  options: Option[];
  multiple?: boolean;
  placeholder?: string;
}

const Select = <T extends FieldValues>({
  options,
  multiple = false,
  placeholder = "Select...",
  control,
  name,
}: SelectProps<T>) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control });

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
    setHighlightedIndex(null);
  };

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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!isOpen) {
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        setIsOpen(true);
        setHighlightedIndex(0);
        event.preventDefault();
      }
      return;
    }

    let newIndex = highlightedIndex;

    if (event.key === "ArrowDown") {
      newIndex = highlightedIndex === null || highlightedIndex >= options.length - 1 ? 0 : highlightedIndex + 1;
    } else if (event.key === "ArrowUp") {
      newIndex = highlightedIndex === null || highlightedIndex <= 0 ? options.length - 1 : highlightedIndex - 1;
    } else if (event.key === "Enter" || event.key === " ") {
      if (highlightedIndex !== null) {
        handleSelect(options[highlightedIndex].value);
      }
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }

    setHighlightedIndex(newIndex);

    // Auto-scroll selected option into view
    if (listRef.current && newIndex !== null) {
      const item = listRef.current.children[newIndex] as HTMLLIElement;
      if (item) {
        item.scrollIntoView({ block: "nearest" });
      }
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-left shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <span>
          {multiple
            ? value?.map((val: string) => options.find((o) => o.value === val)?.label).join(", ") ||
              placeholder
            : options.find((o) => o.value === value)?.label || placeholder}
        </span>
        <span className="ml-2 text-gray-500">▼</span>
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg"
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              className={`flex cursor-pointer items-center gap-2 px-4 py-2 ${
                multiple && value?.includes(option.value) ? "bg-blue-200" : ""
              } ${highlightedIndex === index ? "bg-blue-300" : ""}`}
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
