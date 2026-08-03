import Link from "next/link";

type SidebarPageItemProps = {
  title: string;
  subtitle?: string;
  initial: string;
  isActive: boolean;
  isExpanded: boolean;
  href?: string;
  onClick?: () => void;
};

export function SidebarPageItem({
  title,
  initial,
  isActive,
  isExpanded,
  href,
  onClick,
}: SidebarPageItemProps) {
  // وقتی سایدبار بسته است، هیچ آیتمی نمایش داده نشود
  if (!isExpanded) {
    return null;
  }

  const className = `group relative flex w-full min-w-0 items-center gap-2.5 overflow-hidden rounded-xl px-3 py-2.5 text-right text-sm transition-all duration-150 ${
    isActive
      ? "bg-white text-slate-950 shadow-sm"
      : "text-white/70 hover:bg-white/8 hover:text-white"
  }`;

  const content = (
    <>
      {/* Active indicator dot */}
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-150 ${
          isActive ? "bg-(--lightBlue)" : "bg-white/20 group-hover:bg-white/40"
        }`}
      />
      <span
        className={`min-w-0 flex-1 truncate font-medium ${
          isActive ? "text-slate-900" : "text-white/80"
        }`}
      >
        {title}
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}
