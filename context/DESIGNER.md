# GUT Design System

## Setup

Install the theme components:

```bash
bunx shadcn@latest add https://tweakcn.com/r/themes/candyland.json
```

## Design Philosophy

GUT should feel like a **food magazine that a 25-year-old actually reads**. It has personality without trying too hard. It's confident, not loud.

### The Vibe

- **Editorial, not corporate.** This is a food publication, not a SaaS dashboard.
- **Quiet confidence.** Let the content breathe. White space is a feature.
- **Warm but not cutesy.** Approachable without being childish.
- **Personality in the details.** A slightly unexpected color, a playful microinteraction — but restrained.

### Reference Points

- Bon Appétit's digital presence
- Modern food Substacks (like The Perfect Loaf, or Alison Roman's)
- The NYT Cooking app's typography
- Pandan (the recipe app)

---

## Typography

### Font Stack

```css
--font-serif: 'Instrument Serif', 'Georgia', serif;
--font-sans: 'Poppins', 'Inter', sans-serif;
--font-mono: 'Roboto Mono', monospace;
```

**Install Google Fonts:**
```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Poppins:wght@400;500;600&family=Roboto+Mono&display=swap" rel="stylesheet">
```

### Usage Rules

| Element | Font | Weight | Notes |
|---------|------|--------|-------|
| Headlines (h1, h2) | Instrument Serif | Regular | The personality. Use liberally. |
| Recipe titles | Instrument Serif | Regular | Should feel like a magazine cover line |
| Body text | Poppins | Regular (400) | Clean, readable |
| UI labels, buttons | Poppins | Medium (500) | Slightly heavier for affordance |
| Ingredient lists | Poppins | Regular | Left-aligned, generous line height |
| Recipe steps | Poppins | Regular | Numbered, clear hierarchy |
| Category labels (the 5 F's) | Poppins | Semibold (600) | All caps, letterspaced |

### Hierarchy

```css
h1 { font-size: 2.5rem; line-height: 1.1; font-family: var(--font-serif); }
h2 { font-size: 1.75rem; line-height: 1.2; font-family: var(--font-serif); }
h3 { font-size: 1.25rem; line-height: 1.3; font-family: var(--font-sans); font-weight: 600; }
body { font-size: 1rem; line-height: 1.6; font-family: var(--font-sans); }
.label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
```

---

## Color

Use the candyland theme as a base, but with restraint. The palette is warm and slightly playful.

### Primary Usage

- **Background:** Off-white/cream (`--background`). Never pure white.
- **Text:** Near-black (`--foreground`). Never pure black.
- **Primary accent:** The warm peachy-pink (`--primary`). Use for primary buttons, active states.
- **Secondary accent:** The soft blue (`--secondary`). Use sparingly for contrast.
- **Highlight:** The bright yellow (`--accent`). Very sparingly — a single highlight, a hover state.

### Color Rules

1. **Mostly neutral.** 80% of the UI should be background + foreground.
2. **One pop of color per view.** Don't compete for attention.
3. **The 5 F's get subtle color coding** — but muted, not primary colors. Think pastels or tinted grays.
4. **Dark mode should feel cozy**, not stark. The dark background should have warmth.

### F Category Colors (Suggested)

Use these as subtle background tints on ingredient cards:

| Category | Light Mode | Dark Mode |
|----------|------------|-----------|
| Fat | `oklch(0.95 0.02 80)` — warm cream | `oklch(0.25 0.02 80)` |
| Foundation | `oklch(0.95 0.02 140)` — sage tint | `oklch(0.25 0.02 140)` |
| Feature | `oklch(0.95 0.03 25)` — peachy | `oklch(0.25 0.03 25)` |
| Flavor | `oklch(0.95 0.02 250)` — cool blue tint | `oklch(0.25 0.02 250)` |
| Finish | `oklch(0.95 0.04 110)` — citrus hint | `oklch(0.25 0.04 110)` |

These should be *barely* perceptible — a whisper of differentiation, not a rainbow.

---

## Layout

### Spacing

- **Generous margins.** Content should never feel cramped.
- **Card-based UI** for the 5 F's — but cards with subtle borders or shadows, not heavy outlines.
- **Max content width:** 640px for recipe text. Recipes should read like an article.
- **Ingredient grid:** Can go wider, but ingredients should be chunky and tappable.

### The Generate Flow

```
┌─────────────────────────────────────────┐
│  [Season ▾]  [Cuisine ▾]  [Servings ▾]  │  ← Controls row, compact
├─────────────────────────────────────────┤
│                                         │
│   ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│   │ FAT │ │FOUND│ │FEAT │ │FLAV │ │FINI │  ← 5 F cards, equal width
│   │     │ │     │ │     │ │     │ │     │
│   │Olive│ │Onion│ │Chick│ │Cocon│ │Lime │  ← Ingredient name
│   │ oil │ │Garli│ │thigh│ │milk │ │Thai │
│   │     │ │     │ │     │ │     │ │basil│
│   │ 🔄  │ │ 🔒  │ │ 🔄  │ │ 🔄  │ │ 🔄  │  ← Re-roll / Lock toggle
│   └─────┘ └─────┘ └─────┘ └─────┘ └─────┘
│                                         │
│          [ Make This Meal ]             │  ← Primary CTA, full width
│                                         │
└─────────────────────────────────────────┘
```

### The Recipe View

```
┌─────────────────────────────────────────┐
│  ← Back                        [👎][🔄] │  ← Minimal header
├─────────────────────────────────────────┤
│                                         │
│   Coconut Chicken with                  │  ← Serif headline
│   Lemongrass and Thai Basil             │
│                                         │
│   A weeknight curry that comes together │  ← Headnote, italic
│   in 30 minutes.                        │
│                                         │
│   ─────────────────────────────────────│
│                                         │
│   INGREDIENTS                 Serves 4  │
│                                         │
│   • 2 tablespoons vegetable oil         │
│   • 1 medium onion, diced               │
│   • 3 cloves garlic, minced             │
│   • ...                                 │
│                                         │
│   ─────────────────────────────────────│
│                                         │
│   INSTRUCTIONS                          │
│                                         │
│   1. Heat oil in a large skillet...     │
│   2. Add onion and cook until...        │
│   ...                                   │
│                                         │
│   Serve over jasmine rice.              │  ← Accompaniment, subtle
│                                         │
└─────────────────────────────────────────┘
```

---

## Components

### Ingredient Card

- Subtle background tint based on F category
- Category label at top (uppercase, small, muted)
- Ingredient name centered, larger
- Lock/re-roll icon at bottom
- On hover: slight lift (shadow), cursor pointer
- Locked state: subtle border or checkmark icon

### Primary Button ("Make This Meal")

- Full width on mobile, constrained on desktop
- Uses `--primary` background
- Generous padding (py-4)
- Serif font for the label (unexpected, editorial)
- Subtle hover: darken or lift

### Cuisine/Season/Serving Selectors

- shadcn Select component
- Minimal styling — these are controls, not features
- Dropdown should feel fast and light

### Recipe Card (output)

- White/cream background
- Subtle shadow
- Generous padding
- Clear typographic hierarchy
- Ingredients and steps should be easy to scan

---

## Microinteractions

Keep these subtle:

- **Re-roll:** Quick fade-out/fade-in of ingredient name. Maybe a slight rotation of the icon.
- **Lock:** Icon swap (unlock ↔ lock). Maybe a subtle "click" feel.
- **Generate:** Button gets a loading state. Recipe fades in when ready.
- **Cuisine switch:** Ingredients that change should animate. Locked ones stay put.

---

## Don'ts

- ❌ No gradients
- ❌ No heavy drop shadows
- ❌ No rounded-full buttons (too playful)
- ❌ No emoji in UI labels (we're not a mobile game)
- ❌ No skeleton loaders that feel sterile — if loading, use a simple spinner or pulse
- ❌ No all-caps headlines (only labels)
- ❌ No pure white or pure black

---

## Do's

- ✅ Let serif headlines do the work
- ✅ Embrace asymmetry where it feels editorial
- ✅ Use whitespace to create hierarchy
- ✅ Keep the UI chrome minimal — the recipe is the product
- ✅ Make the 5 F's feel like a coherent set, but not identical
- ✅ Dark mode should feel like reading a cookbook by lamplight
