'use client';

import { CodeBlock } from './CodeBlock';

const CLAUDE_CODE_PROMPT = `I'm building GUT (Grand Unified Theory of Cooking), a meal planning app. All product requirements, design guidelines, example outputs, and the AI prompt are documented in the /context folder:

- /context/GUT_PRD.md — Full product spec, user flow, architecture, constraints
- /context/DESIGNER.md — Design system, typography, colors, layout wireframes
- /context/EXAMPLES.md — 3 example recipes showing the target output format
- /context/PROMPT.md — System prompt for the Anthropic API + example API call

Read all four files before proceeding.

## Tech Stack

- Frontend: React + TypeScript
- Styling: Tailwind + shadcn/ui
- Runtime: Bun
- Database: Supabase (Postgres)
- Hosting: Vercel
- AI: Anthropic Claude API

## Setup Tasks

Work through these systematically. Pause after each major section so I can review and provide any needed credentials.

### 1. Project Scaffolding

- Initialize a new project with Bun
- Set up React + TypeScript + Tailwind
- Install shadcn/ui and configure it
- Install the candyland theme: \`bunx shadcn@latest add https://tweakcn.com/r/themes/candyland.json\`
- Set up the font stack from DESIGNER.md (Instrument Serif, Poppins, Roboto Mono via Google Fonts)
- Create the folder structure

### 2. Environment & Config

- Create .env.example documenting required variables:
  - SUPABASE_URL
  - SUPABASE_ANON_KEY
  - ANTHROPIC_API_KEY
- Set up Supabase client
- Set up Anthropic client

### 3. Database Schema

Based on GUT_PRD.md, create Supabase migrations for:

- \`cuisines\` table (id, name, created_at)
- \`ingredients\` table (id, name, category enum for the 5 F's, tags array, created_at)
- \`cuisine_ingredients\` join table (cuisine_id, ingredient_id)
- \`feedback\` table for thumbs down logging (id, recipe_inputs jsonb, created_at)

Create the SQL migrations. I'll run them in Supabase.

### 4. Seed Data

Generate seed data for 4 cuisines to start:
- Thai
- Italian
- Mexican
- American (Southern)

For each cuisine, generate 6-8 ingredients per F category (Fat, Foundation, Feature, Flavor, Finish). All ingredients must be Walmart-accessible. Some ingredients can belong to multiple cuisines.

Output as a SQL insert script I can run.

### 5. Core Components

Build the UI components following DESIGNER.md:

- \`CuisineSelector\` — dropdown to pick or randomize cuisine
- \`SeasonSelector\` — dropdown, defaults to current season based on date
- \`ServingsSelector\` — dropdown (2, 4, 6, 8)
- \`IngredientCard\` — displays one F category with ingredient, lock/re-roll controls
- \`IngredientGrid\` — the 5 F cards in a row
- \`GenerateButton\` — primary CTA
- \`RecipeView\` — displays the generated recipe
- \`FeedbackButtons\` — thumbs down + re-roll

### 6. Core Logic

- \`useIngredients\` hook — fetches random ingredients from Supabase by cuisine
- \`useRecipe\` hook — calls Anthropic API with the system prompt from PROMPT.md
- Lock/unlock state management for ingredients
- Cuisine switching logic (re-fetch unlocked ingredients, keep locked)
- Season detection based on current date and equinox

### 7. Pages & Routing

- \`/\` — Main generate flow (selectors → ingredient grid → generate button)
- Recipe appears below or replaces the grid after generation
- No separate pages needed for MVP

### 8. API Route

- \`/api/generate\` — POST endpoint that:
  - Accepts cuisine, season, servings, and 5 ingredients
  - Calls Anthropic API with the system prompt
  - Returns the recipe text
  - Logs to feedback table if thumbs down

### 9. Deployment Prep

- Vercel config
- Environment variable setup instructions

---

## How to Work

1. Start with scaffolding. Show me the folder structure before writing components.
2. Show me the database schema SQL before I run migrations.
3. Show me the seed data for review before inserting.
4. Build components incrementally — I want to review the ingredient card and recipe view before the full page.
5. Test the Anthropic integration with a hardcoded example before wiring up the full flow.

Let's start with step 1: project scaffolding.`;

export function ClaudeCodePrompt() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="font-serif text-2xl mb-4">Claude Code Prompt</h2>
      <p className="font-sans text-muted-foreground mb-6">
        Copy and paste this prompt into Claude Code to build the GUT project from scratch.
      </p>
      <CodeBlock
        code={CLAUDE_CODE_PROMPT}
        title="GUT Project Setup"
        language="markdown"
      />
    </div>
  );
}
