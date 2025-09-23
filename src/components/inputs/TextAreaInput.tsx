type TextAreaInputProps = {
  label: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

function TextAreaInput({
  label,
  name,
  placeholder,
  value,
  onChange,
}: TextAreaInputProps) {
  return (
    <div>
      <label className="block" htmlFor={name}>
        {label}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        placeholder={placeholder}
        className="border border-gray-400 p-2 rounded-sm w-full focus:outline-none focus:ring-2 focus:ring-fuchsia-200"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default TextAreaInput;
