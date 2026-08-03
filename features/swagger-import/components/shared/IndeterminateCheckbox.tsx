"use client";

import { useEffect, useRef } from "react";

type Props = {
  checked: boolean;

  indeterminate: boolean;

  onChange: () => void;

  size?: "sm" | "md";
};

export function IndeterminateCheckbox({
  checked,
  indeterminate,
  onChange,
  size = "md",
}: Props) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className={`
        rounded
        accent-(--lightBlue)

        ${size === "sm" ? "h-4 w-4" : "h-5 w-5"}
      `}
    />
  );
}
