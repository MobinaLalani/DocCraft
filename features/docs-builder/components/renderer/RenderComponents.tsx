import type { PageComponent } from "@/lib/docs/schema";
import { pageBlockRegistry } from "./pageBlockRegistry";
import type { PageBlockComponent } from "@/features/docs-builder/types/types";

function resolveBlockComponent<T extends PageComponent>(
  component: T,
): PageBlockComponent<T> {
  return pageBlockRegistry[component.type] as PageBlockComponent<T>;
}

export function renderComponent(component: PageComponent) {
  const Block = resolveBlockComponent(component);

  return <Block key={component.id} component={component} />;
}
