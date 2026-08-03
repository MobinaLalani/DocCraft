import type {
  FontSizeToken,
  FontWeightToken,
  LineHeightToken,
  TextStyle,
} from "@/lib/docs/schema";

const fontSizeMap: Record<FontSizeToken, string> = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
};

const fontWeightMap: Record<FontWeightToken, number> = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

const lineHeightMap: Record<LineHeightToken, string> = {
  normal: "1.5",
  relaxed: "1.75",
  loose: "2",
};

export function getFontSizeValue(fontSize?: FontSizeToken) {
  return fontSize ? fontSizeMap[fontSize] : undefined;
}

export function getFontWeightValue(fontWeight?: FontWeightToken) {
  return fontWeight ? fontWeightMap[fontWeight] : undefined;
}

export function buildTextStyle(style?: TextStyle): React.CSSProperties {
  return {
    color: style?.color,
    fontSize: getFontSizeValue(style?.fontSize),
    fontWeight: getFontWeightValue(style?.fontWeight),
    fontStyle: style?.italic ? "italic" : undefined,
    textDecoration: style?.underline ? "underline" : undefined,
    textAlign: style?.align,
    lineHeight: style?.lineHeight ? lineHeightMap[style.lineHeight] : undefined,
  };
}
