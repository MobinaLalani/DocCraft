"use server";

import type { DocPage } from "@/lib/docs/schema";
import type { MenuGroup } from "@/lib/docs/workspace";
import { getAllPages, savePage } from "@/lib/docs/page-service";
import {
  readStoredMenuGroups,
  writeStoredMenuGroups,
} from "@/lib/docs/storage";
import { requireRole } from "@/lib/auth/server";
import type { OpenApiSpec } from "@/features/swagger-import/components/model/index";

export async function fetchOpenApiAction(
  url: string,
): Promise<{ spec?: OpenApiSpec; error?: string }> {
  await requireRole("admin");

  const trimmed = url.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return { error: "URL باید با http:// یا https:// شروع شود." };
  }

  try {
    const response = await fetch(trimmed, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      return { error: `خطا ${response.status}: ${response.statusText}` };
    }

    const spec = (await response.json()) as OpenApiSpec;

    if (!spec.paths) {
      return { error: "فایل OpenAPI معتبر نیست — فیلد paths یافت نشد." };
    }

    return { spec };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "خطا در دریافت spec",
    };
  }
}

export async function importDocsAction(
  menuGroups: MenuGroup[],
  pages: DocPage[],
): Promise<{ success: boolean; error?: string; count: number }> {
  await requireRole("admin");

  try {
    // Merge menu groups
    const existingGroups = await readStoredMenuGroups();
    await writeStoredMenuGroups([...existingGroups, ...menuGroups]);

    // Assign sequential IDs and save pages
    const existingPages = await getAllPages();
    let nextId =
      existingPages.reduce((max, p) => Math.max(max, p.id), 0) + 1;

    for (const page of pages) {
      await savePage({ ...page, id: nextId++ });
    }

    return { success: true, count: pages.length };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "خطا در ذخیره داکیومنت",
      count: 0,
    };
  }
}
