"use client";

type ToggleSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel: string;
  disabled?: boolean;
  className?: string;
};

export default function ToggleSwitch({
  checked,
  onChange,
  ariaLabel,
  disabled = false,
  className = "",
}: ToggleSwitchProps) {
  return (
    <label
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-border bg-background-secondary transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-accent/50 focus-within:ring-offset-2 focus-within:ring-offset-background ${
        checked ? "border-accent/50 bg-accent/20" : ""
      } ${disabled ? "cursor-not-allowed opacity-50" : ""} ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={ariaLabel}
        disabled={disabled}
        className="sr-only"
      />
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-border shadow-sm transition-transform ${
          checked
            ? "translate-x-5 bg-accent"
            : "translate-x-0.5 bg-text-muted"
        }`}
      />
    </label>
  );
}
