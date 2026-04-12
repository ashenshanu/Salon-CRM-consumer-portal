import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, className = '', children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={[
          'block w-full rounded-lg border px-3 py-2.5 text-sm text-slate-900 bg-white transition-colors duration-150',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
          error
            ? 'border-red-400 focus-visible:ring-red-300'
            : 'border-slate-200 focus-visible:ring-primary/30 hover:border-slate-300',
          'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = 'Select';
export default Select;
