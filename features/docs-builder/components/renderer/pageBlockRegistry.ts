import { CodeBlock } from "@/features/docs-builder/components/pageBuilderComponents/CodeBlock";
import { EndpointBlock } from "@/features/docs-builder/components/pageBuilderComponents/EndpointBlock";
import { FieldGroupBlock } from "@/features/docs-builder/components/pageBuilderComponents/FieldGroupBlock";
import { HeadingBlock } from "@/features/docs-builder/components/pageBuilderComponents/HeadingBlock";
import { NoteBlock } from "@/features/docs-builder/components/pageBuilderComponents/NoteBlock";
import { ParagraphBlock } from "@/features/docs-builder/components/pageBuilderComponents/ParagraphBlock";
import { TableBlock } from "@/features/docs-builder/components/pageBuilderComponents/TableBlock";
import type { PageBlockRegistry } from "@/features/docs-builder/types/types";

export const pageBlockRegistry: PageBlockRegistry = {
  heading: HeadingBlock,
  note: NoteBlock,
  paragraph: ParagraphBlock,
  endpoint: EndpointBlock,
  "field-group": FieldGroupBlock,
  table: TableBlock,
  code: CodeBlock,
};
