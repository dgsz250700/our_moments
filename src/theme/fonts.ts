/**
 * Shared font name constants for the scrapbook typography system.
 *
 * Pairing:
 *   DECORATIVE  — Dancing Script   (handwritten, romantic) → main title
 *   SERIF       — Playfair Display (elegant, editorial)    → section headings
 *   BODY        — Lato             (clean, soft)           → body / captions
 */

export const Fonts = {
  // Main page title – highest visual impact
  title: 'DancingScript_700Bold',

  // Section headings: CalendarPanel, MapPanel, "Memories" label
  heading: 'PlayfairDisplay_700Bold',
  headingItalic: 'PlayfairDisplay_700Bold_Italic',

  // Sub-headings and medium emphasis
  subheading: 'PlayfairDisplay_600SemiBold',

  // Body text, notes, readable UI
  body: 'Lato_400Regular',
  bodyItalic: 'Lato_400Regular_Italic',

  // Labels, dates, metadata — slightly weighted
  label: 'Lato_700Bold',
} as const;
