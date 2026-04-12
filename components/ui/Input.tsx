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
          'block w-full rounded-lg border px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 transition-colors duration-150',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
          error
            ? 'border-red-400 focus-visible:ring-red-300'
            : 'border-stone-300 focus-visible:ring-stone-300 hover:border-stone-400',
          'disabled:bg-stone-50 disabled:text-stone-400 disabled:cursor-not-allowed',
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
