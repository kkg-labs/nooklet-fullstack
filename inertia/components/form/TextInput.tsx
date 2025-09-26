import React from 'react';

export type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export default function TextInput({
  className = '',
  ...props
}: TextInputProps) {
  const base = 'input input-bordered border-base-300 bg-base-100 w-full';
  return <input {...props} className={`${base} ${className}`.trim()} />;
}
