import { useController, Control, FieldValues, Path } from 'react-hook-form';

interface RadioProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  options: string[];
}

const Radio = <T extends FieldValues>({ name, control, options }: RadioProps<T>) => {
  const {
    field: { value, onChange },
  } = useController({ name, control });

  return (
    <div className="flex flex-wrap space-x-4">
      {options.map((option) => (
        <label key={option} className="flex items-center space-x-2">
          <input
            type="radio"
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
};

export default Radio;
