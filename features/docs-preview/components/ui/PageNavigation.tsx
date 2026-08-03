import Link from "next/link";

import type { PageNavigationItem } from "@/features/docs-preview/model/getPageNavigation";
import { ArrowIcon } from "@/components/ui/icons/ArrowIcon";

type PageNavigationProps = {
  previousPage: PageNavigationItem | null;
  nextPage: PageNavigationItem | null;
  interactive?: boolean;
  onSelectPage?: (slug: string) => void;
};

type NavigationButtonProps = {
  label: string;
  page: PageNavigationItem | null;
  direction: "previous" | "next";
  interactive?: boolean;
  onSelectPage?: (slug: string) => void;
};

const baseButtonClass =
  "group flex min-h-[104px] items-center gap-4 rounded-[1.75rem] border px-4 py-4 text-right transition-all duration-300";

const enabledButtonClass =
  "border-slate-200 bg-white text-slate-950 shadow-sm hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-lg";

const disabledButtonClass =
  "cursor-not-allowed border-slate-200 bg-slate-50/80 text-slate-400";

function NavigationButton({
  label,
  page,
  direction,
  interactive = false,
  onSelectPage,
}: NavigationButtonProps) {
  const arrowRotation = direction === "previous" ? "-rotate-90" : "rotate-90";
  const helperText = page
    ? `/pages/${page.slug}`
    : direction === "previous"
      ? "در ابتدای این زیرمنو هستی"
      : "به انتهای این زیرمنو رسیده‌ای";
  const fallbackTitle =
    direction === "previous" ? "صفحه قبلی وجود ندارد" : "صفحه بعدی وجود ندارد";
  const iconWrapperClass = page
    ? "border-sky-200 bg-sky-50 text-sky-700 group-hover:border-sky-300 group-hover:bg-sky-100"
    : "border-slate-200 bg-slate-100 text-slate-400";
  const contentAlignmentClass =
    direction === "previous" ? "text-left" : "text-right";

  const content = (
    <>
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition ${iconWrapperClass}`}
      >
        <ArrowIcon
          strokeColor={page ? "#0369a1" : "#94a3b8"}
          className={`h-5 w-5 transition-transform duration-300 ${arrowRotation} ${
            page ? "group-hover:scale-110" : ""
          }`}
        />
      </div>

      <div className={`min-w-0 flex-1 space-y-1 ${contentAlignmentClass}`}>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="truncate text-base font-semibold leading-6">
          {page ? page.title : fallbackTitle}
        </p>
        <p className="truncate text-xs text-slate-500">{helperText}</p>
      </div>
    </>
  );

  const buttonClasses = `${baseButtonClass} ${page ? enabledButtonClass : disabledButtonClass}`;

  if (!page) {
    return (
      <div aria-disabled="true" className={`${buttonClasses}`}>
        {content}
      </div>
    );
  }

  if (interactive) {
    return (
      <button
        type="button"
        onClick={() => onSelectPage?.(page.slug)}
        className={buttonClasses}
      >
        {content}
      </button>
    );
  }

  return (
    <Link href={`/pages/${page.slug}`} className={buttonClasses}>
      {content}
    </Link>
  );
}

export function PageNavigation({
  previousPage,
  nextPage,
  interactive = false,
  onSelectPage,
}: PageNavigationProps) {
  return (
    <nav
      aria-label="ناوبری بین صفحات زیرمنو"
      className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-sky-50/40 p-4 shadow-sm sm:p-5"
    >
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div className="text-right">
          <p className="text-xs font-medium tracking-[0.2em] text-sky-700">
            PAGE NAVIGATION
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-950">
            جابه‌جایی بین صفحات
          </h3>
        </div>
        <div className="rounded-full border border-sky-200 bg-white px-3 py-2 text-xs font-medium text-sky-700 shadow-sm">
          زیرمنوی جاری
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <NavigationButton
          label="صفحه قبل"
          page={previousPage}
          direction="previous"
          interactive={interactive}
          onSelectPage={onSelectPage}
        />
        <NavigationButton
          label="صفحه بعد"
          page={nextPage}
          direction="next"
          interactive={interactive}
          onSelectPage={onSelectPage}
        />
      </div>
    </nav>
  );
}
