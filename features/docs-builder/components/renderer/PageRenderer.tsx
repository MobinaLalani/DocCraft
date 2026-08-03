import type { DocPage } from "@/lib/docs/schema";
import { renderComponent } from "./RenderComponents";

type PageRendererProps = {
  page: DocPage;
  className?: string;
};

export function PageRenderer({ page, className }: PageRendererProps) {
  return (
    <article
      className={`space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-right shadow-sm sm:p-8 ${
        className ?? ""
      }`}
    >
      <header className="space-y-3">
        <p className="text-sm font-medium tracking-[0.2em] text-slate-500">
          /pages/{page.slug}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          {page.title}
        </h1>
        {page.description ? (
          <p className="max-w-3xl text-base leading-7 text-slate-600">
            {page.description}
          </p>
        ) : null}
      </header>

      <section className="space-y-5">
        {page.components.map(renderComponent)}
      </section>
    </article>
  );
}
