export function detectUrlHint(url: string): string | null {
  if (!url.trim()) {
    return null;
  }

  const lower = url.toLowerCase();

  if (lower.includes("index.html") || lower.match(/\/swagger\/?$/)) {
    return (
      "آدرس Swagger UI هست. " +
      "برای JSON از swagger-json یا api-json استفاده کنید."
    );
  }

  return null;
}
