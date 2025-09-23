type TextboxAreaInputProps = {
  label: string;
  name: string;
  placeholder: string;
  value: string;
  row: number;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
};

function TextboxAreaInput({
  label,
  name,
  placeholder,
  value,
  onChange,
  row = 4,
}: TextboxAreaInputProps) {
  return (
    <div>
      <label className="block" htmlFor={name}>
        {label}
      </label>
      <textarea
        name={name}
        placeholder={placeholder}
        className="border border-gray-400 p-2 rounded-sm w-full focus:outline-none focus:ring-2 focus:ring-fuchsia-200"
        value={value}
        onChange={onChange}
        rows={row}
      />
    </div>
  );
}

export default TextboxAreaInput;
