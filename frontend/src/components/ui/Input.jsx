import { forwardRef } from "react";

const Input = forwardRef(({
  label,
  error,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  className = "",
  icon: Icon,
  required = false,
  ...props
}, ref) => {
  return (
    <div className="w-full flex flex-col">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative rounded-xl">
        {Icon && (
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500 pointer-events-none">
            <Icon className="text-base" />
          </span>
        )}
        <input
          ref={ref}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full border bg-transparent text-slate-900 dark:text-white rounded-xl py-3 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm ${
            Icon ? "pl-10" : "pl-4"
          } ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
              : "border-slate-200 dark:border-slate-700 focus:border-brand-500"
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs text-red-500 mt-1.5 font-medium">{error}</span>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
