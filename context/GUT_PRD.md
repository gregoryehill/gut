# GUT: Grand Unified Theory of Cooking

**Product Requirements Document**  
Version 1.0 | January 2026

---

## Overview

GUT is a meal planning app built on a simple thesis: all cooked meals across all cuisines can be distilled into five fundamental components. The app uses AI to generate simple, accessible recipes by combining curated ingredients within this framework.

---

## The Unified Theory

Every meal can be constructed from five fundamental elements, regardless of cuisine:

| Category | Role | When It Happens |
|----------|------|-----------------|
| **Fat** | Cooking medium, richness | First in the pan |
| **Foundation** | Aromatics, base vegetables | Builds the flavor base |
| **Feature** | The star of the dish | Main component |
| **Flavor** | Liquid, sauce, braising medium | Brings it together |
| **Finish** | Brightness, balance, contrast | Right before serving |

**The constraint is firm: every recipe requires all five components.** If a dish does not fit this model, it is out of scope for the app.

---

## User Inputs

- **Cuisine:** User can select a specific cuisine or randomize. The app constrains ingredient selection to items that make sense within that cuisine.
- **Season:** Defaults to current season based on the equinox. User can randomize or select manually. Season affects the vibe and appropriateness of the generated recipe (hearty braises in winter, lighter dishes in summer).
- **Servings:** User-selectable. Passed to the AI prompt to adjust quantities.

---

## MVP User Flow

1. **Open app.** Defaults are set: current season, random cuisine.
2. **Generate ingredients.** User taps a button. App pulls one ingredient from each of the five categories from the database. This is instant and cheap (no AI).
3. **Review the 5 F's.** User sees Fat, Foundation, Feature, Flavor, Finish displayed clearly.
4. **Re-roll or lock.** User can tap any single ingredient to re-roll just that one (free, instant). User can lock any ingredient they want to keep.
5. **Switch cuisine.** User can change cuisine. Unlocked ingredients are re-pulled from the new cuisine. Locked ingredients remain. This is the magic trick that demonstrates the theory.
6. **Generate recipe.** User taps "Make this." AI generates the full recipe. This is the only step that uses compute.
7. **Feedback.** If the recipe is unsatisfactory, user can thumbs down (for feedback logging) and re-roll ingredients to try again.

---

## Technical Architecture

### Tech Stack

- **Frontend:** React with TypeScript, shadcn/ui components
- **Runtime/Tooling:** Bun
- **Database:** Supabase (Postgres)
- **Hosting:** Vercel
- **AI:** Anthropic Claude API for recipe generation

### Two-Step Flow

**Step 1: Compose (database-driven)**  
User picks season and cuisine. App pulls ingredients from the database. Re-rolling and cuisine switching are free operations. No AI involved.

**Step 2: Generate (AI-driven)**  
User commits by tapping "Make this." Prompt fires with structured data. AI returns the recipe.

### Database Schema

**Ingredients table:** `id`, `name`, `category` (one of the 5 F's), `tags` (optional, for compatibility)

**Cuisines table:** `id`, `name`

**Ingredient-Cuisine join table:** Many-to-many relationship. An ingredient can belong to multiple cuisines (e.g., fish sauce works in Thai, Vietnamese, Filipino, and as an anchovy substitute in Italian).

### AI Prompt Structure

The prompt instructs the AI to write an NYT Cooking-style recipe: short, confident headnote; quantities that assume basic competence; steps that combine actions efficiently. The prompt includes: cuisine, season, servings, and the five selected ingredients.

---

## Recipe Output Format

The AI generates a complete recipe in the style of NYT Cooking:

- A short, appealing headline
- A one-sentence headnote
- An ingredient list with quantities
- 5-6 numbered steps
- An accompaniment suggestion where appropriate (e.g., "serve over rice")

The AI determines quantities based on the combination and serving count. The AI may include inline substitutions for accessibility (e.g., "2 tablespoons fish sauce, or soy sauce with a squeeze of lime").

---

## Supported Cuisines (v1)

- American (including regional: Southern, Midwest comfort)
- Mexican
- Italian
- Chinese (accessible/Americanized and authentic)
- Thai
- Indian (curry-focused)
- French (bistro/home style)
- Korean
- Japanese (soup/rice bowl focused)
- Mediterranean/Greek

Additional cuisines can be added by expanding the ingredient database.

---

## Meal Types In Scope

**Included:**
- Braises and stews
- Curries and simmered dishes
- Soups
- Stir-fries
- Pasta with sauce
- Rice bowls and grain dishes
- Tacos and filling-based dishes
- Salads with dressing

**Out of scope for MVP:**
- Raw preparations (except salads)
- Simple grilled proteins alone
- Baked goods
- Sandwiches

---

## Key Constraints

- **Walmart accessibility:** All ingredients must be available at a typical Walmart. No luxury or highly niche products. The AI can suggest inline substitutions to handle regional variance.
- **All 5 F's required:** Every recipe must use all five categories. Non-negotiable.
- **Dinner scope:** MVP focuses on dinner. Breakfast, lunch, and snacks are out of scope.

---

## Accompaniments

Starches and sides (rice, noodles, bread) are not part of the 5 F's. They are contextual. The AI adds appropriate serving suggestions based on cuisine and dish type.

---

## Future Features (Post-MVP)

- **Pantry optimizer:** Surface the minimal set of ingredients that unlock the maximum number of recipes. "Here are 40 items. You can make every recipe in this app."
- **"What can I make?":** Input what you have, see which cuisines and meals are unlocked.
- **Gap analysis:** "Buy coconut milk and fish sauce and you unlock Thai and Vietnamese."
- **Technique videos:** Link to instructional videos for core techniques.
- **Dietary filters:** Vegetarian, vegan, gluten-free toggles.

---

## Success Metrics

- **Recipe generation rate:** How often users complete the flow from ingredient selection to recipe generation.
- **Thumbs down rate:** Percentage of generated recipes that receive negative feedback. Target: under 15%.
- **Cuisine switching:** How often users switch cuisines after generating ingredients (indicates engagement with the unified theory).
- **Return usage:** Users who come back within 7 days.

---

## Open Questions

- How many ingredients per category per cuisine? Enough for variety, but curated. Initial estimate: 5-8 per F per cuisine.
- How many cuisines to launch with? Recommendation: 3-4 to prove the concept, then expand.
