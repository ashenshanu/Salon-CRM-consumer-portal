interface FormErrorProps {
  message?: string | null;
  className?: string;
}

export default function FormError({ message, className = '' }: FormErrorProps) {
  if (!message) return null;
  return (
    <p className={`mt-1 text-sm text-red-600 ${className}`} role="alert">
      {message}
    </p>
  );
}
