"use client";

import { SwaggerImportWizard } from "@/features/swagger-import";

export function ImportSwaggerView() {
  return (
    <div className="space-y-6">
      <SwaggerImportWizard />
    </div>
  );
}
