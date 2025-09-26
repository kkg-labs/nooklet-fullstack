import TextInput, { TextInputProps } from './TextInput';

export type LabeledTextInputProps = TextInputProps & {
  id: string;
  label: string;
  containerClassName?: string;
  error?: string | null;
  required?: boolean;
};

export default function LabeledTextInput({
  id,
  label,
  containerClassName = '',
  error,
  required,
  ...inputProps
}: LabeledTextInputProps) {
  return (
    <div className={`form-control ${containerClassName}`.trim()}>
      <label htmlFor={id} className="label">
        <span className="label-text">{label}</span>
      </label>
      <TextInput id={id} required={required} {...inputProps} />
      {error ? (
        <p className="text-error text-sm mt-1 text-[var(--color-red-500)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
