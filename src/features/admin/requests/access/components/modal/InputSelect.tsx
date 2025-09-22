// import React from 'react';

type ISelectFormProps = {
  label: string;
  items: { value: string; label: string }[]; // Items for the dropdown
  value: string[];  // Value is an array of selected strings
  onValueChange: (value: string[]) => void; // Function to handle value change
  multiple: boolean;  // Allow multiple selections
  placeholder: string;
  required?: boolean;  // Optional required field
};

const InputSelect = ({
  label,
  items,
  value,
  onValueChange,
  multiple,
  placeholder,
  required,
  ...props
}: ISelectFormProps) => {
  return (
    <div className="form-control">
      <label className="label">{label}</label>
      <select
        multiple={multiple}  // Set multiple to true/false based on the prop
        value={value}  // Bind the value to the selected options (array of strings)
        onChange={(e) => {
          // Handle the selection of multiple options
          onValueChange(Array.from(e.target.selectedOptions, (option) => option.value));
        }}
        {...props}
        className="select-input"
        required={required}  // Make the field required if specified
      >
        {/* Render each item as an option */}
        {items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default InputSelect;
