export const typography = {
  fonts: {
    display: '"Cinzel", "Times New Roman", serif',
    interface:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    music: '"Bravura", serif',
  },
  scale: {
    displayLarge: {
      fontFamily: "display",
      fontSize: "48px",
      fontWeight: 600,
      lineHeight: 1.1,
      letterSpacing: "0.02em",
    },
    displayMedium: {
      fontFamily: "display",
      fontSize: "36px",
      fontWeight: 600,
      lineHeight: 1.15,
      letterSpacing: "0",
    },
    heading1: {
      fontFamily: "display",
      fontSize: "30px",
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: "0",
    },
    heading2: {
      fontFamily: "display",
      fontSize: "24px",
      fontWeight: 600,
      lineHeight: 1.25,
      letterSpacing: "0",
    },
    heading3: {
      fontFamily: "interface",
      fontSize: "20px",
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: "0",
    },
    bodyLarge: {
      fontFamily: "interface",
      fontSize: "18px",
      fontWeight: 400,
      lineHeight: 1.55,
      letterSpacing: "0",
    },
    body: {
      fontFamily: "interface",
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: "0",
    },
    bodySmall: {
      fontFamily: "interface",
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: 1.45,
      letterSpacing: "0",
    },
    label: {
      fontFamily: "interface",
      fontSize: "13px",
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: "0.03em",
    },
    caption: {
      fontFamily: "interface",
      fontSize: "12px",
      fontWeight: 400,
      lineHeight: 1.35,
      letterSpacing: "0",
    },
  },
} as const;

export type InstrumentaTypography = typeof typography;
