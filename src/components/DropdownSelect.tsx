import type { DropdownOption, DropdownSelectProps } from '@/types';
import React from 'react';

const DropdownSelect: React.FC<DropdownSelectProps> = ({
  id,
  key,
  select,
  options,
  placeholder = 'Select an option',
  onChange,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <select
      id={id}
      key={key}
      value={select}
      onChange={handleChange}
      className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
    >
      <option value="" disabled className="bg-white text-slate-500">
        {placeholder}
      </option>
      {options.map((option: DropdownOption) => (
        <option
          key={option.id}
          value={option.value}
          className="bg-white py-1 text-sm text-slate-700"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default React.memo(DropdownSelect);
