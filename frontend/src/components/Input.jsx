import React from 'react';

const Input = ({ label, name, value, onChange, placeholder, type = 'text', required = false }) => {
  return (
    <div className="mb-4">
      <label className="mb-2 block text-sm font-semibold u-text-ink" htmlFor={name}>
        {label} {required && <span className="u-text-v1">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border u-border-soft bg-white px-4 py-3 text-sm u-text-ink outline-none transition u-focus-border-brand focus:ring-2 u-focus-ring-brand-soft u-placeholder-muted"
      />
    </div>
  );
};

export default Input;



