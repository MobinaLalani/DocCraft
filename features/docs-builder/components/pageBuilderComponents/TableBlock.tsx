import type { TableComponent } from "@/lib/docs/schema";
import type { PageBlockProps } from "@/features/docs-builder/types/types";
import { getFontSizeValue, getFontWeightValue } from "../../utils/textStyle";

export function TableBlock({ component }: PageBlockProps<TableComponent>) {
  const tableStyle = component.style;

  return (
    <div
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      style={{ borderColor: tableStyle?.borderColor }}
    >
      {component.title ? (
        <div
          className="border-b border-slate-200 bg-slate-50/80 px-6 py-4"
          style={{ borderColor: tableStyle?.borderColor }}
        >
          <h3
            className="text-base font-semibold tracking-tight text-slate-900"
            style={{ color: tableStyle?.titleColor }}
          >
            {component.title}
          </h3>
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table dir="rtl" className="min-w-full text-right text-sm">
          <thead>
            <tr
              style={{
                backgroundColor:
                  tableStyle?.headerBackgroundColor ?? "rgba(248,250,252,1)",
              }}
            >
              {component.columns.map((column) => (
                <th
                  key={column.field}
                  className="border-b border-slate-200 px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500"
                  style={{
                    borderColor: tableStyle?.borderColor,
                    color: tableStyle?.headerTextColor,
                    fontSize: getFontSizeValue(tableStyle?.textSize),
                    fontWeight: getFontWeightValue(
                      tableStyle?.headerFontWeight,
                    ),
                  }}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {component.rows?.length ? (
              component.rows.map((row, index) => (
                <tr
                  key={`${component.id}-${index}`}
                  className="transition-colors duration-150 hover:bg-slate-50"
                  style={
                    index % 2 === 1 && tableStyle?.rowStripeColor
                      ? { backgroundColor: tableStyle.rowStripeColor }
                      : undefined
                  }
                >
                  {component.columns.map((column) => (
                    <td
                      key={`${component.id}-${index}-${column.field}`}
                      className="border-b border-slate-100 px-6 py-3.5 text-slate-700"
                      style={{
                        borderColor: tableStyle?.borderColor,
                        color: tableStyle?.bodyTextColor,
                        fontSize: getFontSizeValue(tableStyle?.textSize),
                      }}
                    >
                      {String(row[column.field] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={Math.max(component.columns.length, 1)}
                  className="px-6 py-14 text-center text-sm text-slate-400"
                  style={{
                    color: tableStyle?.bodyTextColor,
                    fontSize: getFontSizeValue(tableStyle?.textSize),
                  }}
                >
                  {component.emptyMessage ?? "داده‌ای برای نمایش وجود ندارد."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
