type SelectInputProps = {
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: Array<{ name: string; value: string }>;
};

function SelectInput({
  label,
  name,
  value,
  onChange,
  options,
}: SelectInputProps) {
  return (
    <div>
      <label htmlFor={name} className="block">
        {label}
      </label>
      <select
        name={name}
        id={name}
        className="border border-gray-400 p-2 rounded-sm w-full focus:outline-none focus:ring-2 focus:ring-fuchsia-200"
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <option key={option.name} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectInput;
