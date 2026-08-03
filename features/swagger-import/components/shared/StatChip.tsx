"use client";

type Props = {
  label: string;

  value: number | string;

  accent?: boolean;
};

export function StatChip({ label, value, accent = false }: Props) {
  return (
    <div
      className={`
        rounded-2xl
        px-5
        py-3
        text-center

        ${accent ? "bg-(--darkBlue) text-white" : "bg-slate-100"}
      `}
    >
      <p className="text-xl font-bold">{value}</p>

      <p className="text-xs opacity-70">{label}</p>
    </div>
  );
}
