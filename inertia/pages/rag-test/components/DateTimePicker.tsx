import React from "react";
import { formatDate } from "../../../../shared/utils";

export type DateTimePickerProps = {
  id: string;
  label?: string;
  value: string; // formatted string
  onChange: (formatted: string, dateObj: Date) => void;
  containerClassName?: string;
};

// Uses native datetime-local input styled with daisyUI v5.
// We convert to formatted string using shared/utils.ts formatDate when changed.
export default function DateTimePicker({ id, label = "Date", value, onChange, containerClassName = "" }: DateTimePickerProps) {
  // Convert formatted value back to input value if possible (best-effort)
  const formattedToInput = (formatted: string) => {
    // Not reversible reliably. Default to now when empty.
    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const iso = e.target.value; // e.g., 2025-08-30T14:30
    if (!iso) return;
    const date = new Date(iso);
    const formatted = formatDate(date);
    onChange(formatted, date);
  };

  return (
    <div className={`form-control ${containerClassName}`.trim()}>
      <label htmlFor={id} className="label">
        <span className="label-text">{label}</span>
      </label>
      <input id={id} type="datetime-local" className="input input-bordered w-full" onChange={handleChange} />
      {/* Show the formatted value below for clarity */}
      {value ? <span className="mt-1 text-xs opacity-70">{value}</span> : null}
    </div>
  );
}

