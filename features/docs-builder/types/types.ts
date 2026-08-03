import type { PageComponent } from "@/lib/docs/schema";

export type PageBlockProps<T extends PageComponent> = {
  component: T;
};

export type PageBlockComponent<T extends PageComponent> = (
  props: PageBlockProps<T>,
) => React.JSX.Element;

export type PageBlockRegistry = {
  [K in PageComponent["type"]]: PageBlockComponent<
    Extract<PageComponent, { type: K }>
  >;
};
