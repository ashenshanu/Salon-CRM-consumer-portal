import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={[
          'block w-full rounded-xl border px-5 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50 transition-all duration-150 font-medium',
          'focus:outline-none focus:ring-2 focus:border-primary',
          error
            ? 'border-red-400 focus:ring-red-200'
            : 'border-slate-200 focus:ring-primary/20 hover:border-slate-300',
          'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
export default Input;
