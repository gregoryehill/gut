'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '@/components/CodeBlock';

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

const EXAMPLE_INPUT_OUTPUT = `Inputs:
- Cuisine: Thai
- Season: Summer
- Fat: Vegetable oil
- Foundation: Shallots, garlic, Thai chiles
- Feature: Chicken thighs
- Flavor: Fish sauce, oyster sauce, chicken stock
- Finish: Lime juice, Thai basil, white pepper

Output:
### Chicken Thighs with Thai Basil and Chiles

A fast, punchy stir-fry that comes together in 20 minutes.

[...full recipe...]`;

const USER_MESSAGE_FORMAT = `Cuisine: Thai
Season: Summer
Servings: 4

Fat: Vegetable oil
Foundation: Shallots, garlic, Thai chiles
Feature: Chicken thighs
Flavor: Fish sauce, oyster sauce, chicken stock
Finish: Lime juice, Thai basil, white pepper`;

export default function HowPage() {
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            &larr; Back to app
          </Button>
        </Link>

        {/* Hero */}
        <header className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-normal mb-4">
            How I Built GUT
          </h1>
          <p className="text-muted-foreground text-xl">
            A technical walkthrough of building a full-stack app with Claude Code
          </p>
        </header>

        {/* Content */}
        <article className="prose prose-neutral dark:prose-invert max-w-none space-y-10">
          {/* Intro */}
          <section>
            <p className="text-lg leading-relaxed">
              I built GUT in about an hour while cooking dinner. It&apos;s obviously a prototype, but it&apos;s a working app with a database, AI-powered recipe generation, and a design system.
            </p>
          </section>

          <hr className="border-border" />

          {/* The Setup */}
          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">The Setup</h2>
            <p className="leading-relaxed">
              I had an idea I&apos;d been thinking about for a while, inspired by two books—Michael Ruhlman&apos;s <a href="https://www.amazon.com/Ratio-Simple-Behind-Everyday-Cooking/dp/1416571728" target="_blank" rel="noopener noreferrer" className="text-foreground font-medium underline underline-offset-2 hover:text-primary transition-colors"><em>Ratio</em></a> and Death &amp; Co&apos;s <a href="https://www.amazon.com/Cocktail-Codex-Fundamentals-Formulas-Evolutions/dp/160774970X" target="_blank" rel="noopener noreferrer" className="text-foreground font-medium underline underline-offset-2 hover:text-primary transition-colors"><em>The Cocktail Codex</em></a> (both are classics if you love cooking or cocktails)—a unified framework for understanding how all cooked meals work. The hypothesis was simple. Every dish across every cuisine can be broken into five components:
            </p>
            <ul className="mt-4 space-y-2">
              <li><strong>Fat</strong> (cooking medium)</li>
              <li><strong>Foundation</strong> (aromatics)</li>
              <li><strong>Feature</strong> (the star)</li>
              <li><strong>Flavor</strong> (liquid/sauce)</li>
              <li><strong>Finish</strong> (brightness at the end)</li>
            </ul>
            <p className="leading-relaxed mt-4">
              A Thai curry and a French braise follow the same structure. They just use different ingredients in each slot.
            </p>
            <p className="leading-relaxed mt-4">
              I wanted to build an app that let you randomize ingredients within this framework, lock what you like, switch cuisines, and generate a recipe. The trick is that when you switch cuisines, locked ingredients stay put. Your chicken thighs remain the Feature whether you&apos;re making Thai or Italian.
            </p>
            <p className="leading-relaxed mt-4">
              That&apos;s the product. Now how do you actually build it?
            </p>
          </section>

          <hr className="border-border" />

          {/* Step 1 */}
          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">Step 1: Talk Through the Idea</h2>
            <p className="leading-relaxed">
              I didn&apos;t start by writing a PRD. I started by having a conversation.
            </p>
            <p className="leading-relaxed mt-4">
              I explained the five F&apos;s framework to Claude and we stress-tested it together. Does aglio e olio fit the model? (Yes. The pasta itself is the Feature.) What about salads? (Yes. The vinaigrette is the Fat.) What about dishes that seem too simple?
            </p>
            <p className="leading-relaxed mt-4">
              This is where the work actually happens. Not in the code. In the thinking.
            </p>
            <p className="leading-relaxed mt-4">
              We went back and forth on questions like:
            </p>
            <ul className="mt-4 space-y-2">
              <li>Should the app be cuisine-aware, or allow weird fusion combinations?</li>
              <li>Where&apos;s the line between Flavor and Finish?</li>
              <li>Is rice a Foundation or something else?</li>
              <li>What counts as &quot;Walmart accessible&quot;?</li>
            </ul>
            <p className="leading-relaxed mt-4">
              Each question forced a decision. Each decision clarified the product.
            </p>
            <p className="leading-relaxed mt-4">
              By the end of this conversation, I had answers:
            </p>
            <ul className="mt-4 space-y-2">
              <li><strong>Cuisine-aware.</strong> Stick to ingredients that make sense within a culture.</li>
              <li><strong>Finish is what happens right before serving.</strong> If it reduces into the dish, it&apos;s Flavor.</li>
              <li><strong>Starches aren&apos;t part of the five F&apos;s.</strong> They&apos;re accompaniments. The AI suggests them.</li>
              <li><strong>Walmart accessible means no specialty stores required.</strong> The AI can suggest substitutions.</li>
            </ul>
            <p className="leading-relaxed mt-4">
              None of this is code. It&apos;s product thinking. But without it, you&apos;re asking Claude Code to make decisions it shouldn&apos;t be making.
            </p>
          </section>

          <hr className="border-border" />

          {/* Step 2 */}
          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">Step 2: Define the Architecture</h2>
            <p className="leading-relaxed">
              Once the product was clear, we talked through how it should work technically.
            </p>
            <p className="leading-relaxed mt-4">
              The key insight: <strong>separate the cheap operations from the expensive ones.</strong>
            </p>
            <p className="leading-relaxed mt-4">
              Pulling random ingredients from a database is cheap. Calling an LLM to generate a recipe is expensive. So the user flow should let people tinker endlessly with ingredient combinations (cheap, instant, no AI) and only call the LLM when they commit.
            </p>
            <p className="leading-relaxed mt-4">
              This meant:
            </p>
            <ol className="mt-4 space-y-4">
              <li>
                <strong>Compose step</strong> (database-driven): User picks cuisine and season. App pulls random ingredients. User can re-roll any ingredient or lock it. User can switch cuisines. All of this is just database queries.
              </li>
              <li>
                <strong>Generate step</strong> (AI-driven): User hits &quot;Make this meal.&quot; Now we call Claude with the five ingredients and get a recipe back.
              </li>
            </ol>
            <p className="leading-relaxed mt-4">
              This architecture came out of conversation, not upfront planning. We talked through the user flow and realized that if every re-roll called the LLM, the app would be slow and expensive.
            </p>
          </section>

          <hr className="border-border" />

          {/* Step 3 */}
          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">Step 3: Decide What Context Claude Code Needs</h2>
            <p className="leading-relaxed">
              Here&apos;s where most people go wrong. They open Claude Code and start typing implementation details. &quot;Create a React component that...&quot; or &quot;Write a function that...&quot;
            </p>
            <p className="leading-relaxed mt-4">
              Don&apos;t do that.
            </p>
            <p className="leading-relaxed mt-4">
              Instead, think about what documents a human developer would need to build this app from scratch. Then write those documents. Claude Code reads them the same way a person would.
            </p>
            <p className="leading-relaxed mt-4">
              For GUT, we identified four documents:
            </p>
            <ol className="mt-4 space-y-2">
              <li><strong>PRD</strong> (product requirements): What are we building? What&apos;s the user flow? What are the constraints?</li>
              <li><strong>Design system</strong>: What should it look like? Typography, colors, spacing, component specs. What&apos;s the vibe?</li>
              <li><strong>Examples</strong>: What does good output look like? For a recipe app, this means actual recipes in the exact format we want.</li>
              <li><strong>Prompt</strong>: The system prompt for the AI that generates recipes. This is separate from the Claude Code prompt.</li>
            </ol>
            <p className="leading-relaxed mt-4">
              We explicitly decided NOT to write:
            </p>
            <ul className="mt-4 space-y-2">
              <li>Database schema (Claude Code can derive it from the PRD)</li>
              <li>Seed data (Claude Code can generate ingredients)</li>
              <li>API route specs (derivable from the architecture)</li>
            </ul>
            <p className="leading-relaxed mt-4">
              The goal is to write context that requires human judgment. Everything else, Claude Code figures out.
            </p>
          </section>

          <hr className="border-border" />

          {/* Step 4 */}
          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">Step 4: Write the PRD</h2>
            <p className="leading-relaxed">
              The PRD isn&apos;t a formality. It&apos;s the source of truth.
            </p>
            <p className="leading-relaxed mt-4">
              Here&apos;s what ours covered:
            </p>
            <p className="leading-relaxed mt-4">
              <strong>The thesis</strong>: Every meal is five components. This is non-negotiable. If a dish doesn&apos;t fit the model, it&apos;s out of scope.
            </p>
            <p className="leading-relaxed mt-4">
              <strong>User inputs</strong>: Cuisine (selectable or random), season (defaults to current, affects vibe), servings (passed to the AI).
            </p>
            <p className="leading-relaxed mt-4">
              <strong>User flow</strong>: Open app → generate ingredients → lock/re-roll → switch cuisine → generate recipe → thumbs down if bad.
            </p>
            <p className="leading-relaxed mt-4">
              <strong>Tech stack</strong>: React, TypeScript, Bun, Supabase, Vercel, Anthropic.
            </p>
            <p className="leading-relaxed mt-4">
              <strong>Constraints</strong>:
            </p>
            <ul className="mt-2 space-y-1">
              <li>All ingredients must be Walmart-accessible</li>
              <li>All five F&apos;s are required in every recipe</li>
              <li>Dinner only (no breakfast, lunch, snacks for MVP)</li>
            </ul>
            <p className="leading-relaxed mt-4">
              <strong>Future features</strong> (out of scope but documented): Pantry optimizer, dietary filters, technique videos.
            </p>
            <p className="leading-relaxed mt-4">
              The PRD was about 800 words. It took maybe 20 minutes to write because we&apos;d already talked through everything.
            </p>
          </section>

          <hr className="border-border" />

          {/* Step 5 */}
          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">Step 5: Write the Design System</h2>
            <p className="leading-relaxed">
              This is where most AI-generated apps fall apart. They look generic. They feel like templates.
            </p>
            <p className="leading-relaxed mt-4">
              The design system document was our chance to give Claude Code actual taste.
            </p>
            <p className="leading-relaxed mt-4">
              We specified:
            </p>
            <p className="leading-relaxed mt-4">
              <strong>Typography</strong>: Instrument Serif for headlines (editorial feel), Poppins for body (clean and modern). The combination feels like a food magazine, not a SaaS dashboard.
            </p>
            <p className="leading-relaxed mt-4">
              <strong>Color philosophy</strong>: Mostly neutral. One pop of color per view. The five F categories get subtle background tints, not a rainbow.
            </p>
            <p className="leading-relaxed mt-4">
              <strong>Layout</strong>: Generous whitespace. Cards for ingredients. Recipe view reads like a magazine article, max 640px wide.
            </p>
            <p className="leading-relaxed mt-4">
              <strong>Explicit don&apos;ts</strong>: No gradients. No heavy drop shadows. No emoji in UI labels. No pure white or pure black.
            </p>
            <p className="leading-relaxed mt-4">
              <strong>Reference points</strong>: Bon Appétit&apos;s website. NYT Cooking. Modern food Substacks.
            </p>
            <p className="leading-relaxed mt-4">
              The goal: &quot;A food magazine that a 25-year-old actually reads.&quot;
            </p>
            <p className="leading-relaxed mt-4">
              Writing this document forced us to make aesthetic decisions upfront instead of bikeshedding later.
            </p>
          </section>

          <hr className="border-border" />

          {/* Step 6 */}
          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">Step 6: Write Example Outputs</h2>
            <p className="leading-relaxed">
              If you&apos;re building something with AI-generated content, you need to show what good looks like.
            </p>
            <p className="leading-relaxed mt-4">
              We wrote three complete example recipes:
            </p>
            <ol className="mt-4 space-y-2">
              <li><strong>Thai stir-fry</strong>: Fast, weeknight, 20 minutes</li>
              <li><strong>French braise</strong>: Slow, weekend, 3 hours</li>
              <li><strong>Greek salad</strong>: No-cook, summer, 10 minutes</li>
            </ol>
            <p className="leading-relaxed mt-4">
              Each example showed the full input-to-output mapping:
            </p>
            <div className="my-6">
              <CodeBlock
                code={EXAMPLE_INPUT_OUTPUT}
                language="text"
              />
            </div>
            <p className="leading-relaxed mt-4">
              We also documented the format explicitly: short headline, one-sentence headnote, ingredients in order of use, 5-6 steps with specific times and sensory cues, casual accompaniment suggestion at the end.
            </p>
            <p className="leading-relaxed mt-4">
              This document serves two purposes. It shows Claude Code what the recipe view should display. And it becomes part of the system prompt for recipe generation.
            </p>
          </section>

          <hr className="border-border" />

          {/* Step 7 */}
          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">Step 7: Write the Recipe Generation Prompt</h2>
            <p className="leading-relaxed">
              This is the prompt that runs when someone hits &quot;Make this meal.&quot; It&apos;s separate from the Claude Code prompt.
            </p>
            <p className="leading-relaxed mt-4">
              The prompt explains:
            </p>
            <ul className="mt-4 space-y-2">
              <li>The five F&apos;s framework</li>
              <li>The exact output format</li>
              <li>Style guidelines (NYT Cooking tone, specific times, sensory cues)</li>
              <li>Constraints (Walmart-accessible, no extras beyond salt/pepper/water/starch)</li>
              <li>Tone (&quot;Write like a food magazine editor who respects the reader&apos;s intelligence&quot;)</li>
            </ul>
            <p className="leading-relaxed mt-4">
              We also included an example API call showing how the user message should be structured:
            </p>
            <div className="my-6">
              <CodeBlock
                code={USER_MESSAGE_FORMAT}
                language="text"
              />
            </div>
            <p className="leading-relaxed mt-4">
              This prompt lives in the codebase and gets called at runtime. Claude Code needs to know about it so it can wire up the API correctly.
            </p>
          </section>

          <hr className="border-border" />

          {/* Step 8 */}
          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">Step 8: Write the Claude Code Prompt</h2>
            <p className="leading-relaxed">
              Now we have four context documents. The final step is telling Claude Code what to do with them.
            </p>
            <p className="leading-relaxed mt-4">
              The prompt was structured as a series of tasks with explicit pause points:
            </p>
            <ol className="mt-4 space-y-2">
              <li>Project scaffolding (stop and show me the folder structure)</li>
              <li>Environment setup (I&apos;ll provide API keys)</li>
              <li>Database schema (stop and show me the SQL before running)</li>
              <li>Seed data (stop and let me review the ingredients)</li>
              <li>Core components (build incrementally, let me review)</li>
              <li>Core logic (hooks, state management)</li>
              <li>API routes</li>
              <li>Deployment prep</li>
            </ol>
            <p className="leading-relaxed mt-4">
              The key instruction: &quot;Read all four files before proceeding.&quot;
            </p>
            <p className="leading-relaxed mt-4">
              We also told Claude Code how to work with us:
            </p>
            <ul className="mt-4 space-y-2">
              <li>Show schema before running migrations</li>
              <li>Show seed data before inserting</li>
              <li>Test the Anthropic integration with hardcoded data before wiring up the full flow</li>
            </ul>
            <p className="leading-relaxed mt-4">
              This isn&apos;t about control. It&apos;s about catching mistakes early. If the database schema is wrong, I want to know before there are 500 lines of code depending on it.
            </p>
          </section>

          <hr className="border-border" />

          {/* The Dish */}
          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">The Dish</h2>
            <p className="leading-relaxed">
              This is what I made while building GUT. Roast beef chuck with cauliflower puree and a red wine sauce. Fat: olive oil. Foundation: onion and garlic. Feature: beef chuck. Flavor: red wine, beef drippings, tomato paste. Finish: scallion.
            </p>
            <div className="my-8 rounded-lg overflow-hidden border border-border">
              <Image
                src="/cooking-photo.png"
                alt="Braised beef chuck cooking in a Dutch oven"
                width={1200}
                height={900}
                className="w-full h-auto"
              />
            </div>
            <p className="leading-relaxed">
              The framework works.
            </p>
          </section>

          <hr className="border-border" />

          {/* What Claude Built */}
          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">What Claude Code Built</h2>
            <p className="leading-relaxed">
              From those four documents and one prompt, Claude Code produced:
            </p>
            <ul className="mt-4 space-y-2">
              <li>Database schema (Supabase tables for ingredients, cuisines, join table)</li>
              <li>Seed data for 10 cuisines with 6-8 ingredients per F category</li>
              <li>React components following the design system</li>
              <li>Custom hooks for data fetching and state</li>
              <li>API route for recipe generation</li>
              <li>Season detection based on equinox dates</li>
              <li>The about page explaining the framework</li>
            </ul>
            <p className="leading-relaxed mt-4">
              Total time from starting Claude Code to working app: under an hour.
            </p>
          </section>

          <hr className="border-border" />

          {/* What This Means */}
          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">What This Means</h2>
            <p className="leading-relaxed">
              The bottleneck isn&apos;t coding anymore. It&apos;s thinking.
            </p>
            <p className="leading-relaxed mt-4">
              The four context documents took about 30 minutes to write. But they required me to answer hard questions:
            </p>
            <ul className="mt-4 space-y-2">
              <li>What&apos;s the user flow?</li>
              <li>What are the constraints?</li>
              <li>What does it look like?</li>
              <li>What does good output look like?</li>
            </ul>
            <p className="leading-relaxed mt-4">
              Once those questions were answered clearly enough for a human to understand, Claude Code could execute.
            </p>
            <p className="leading-relaxed mt-4">
              This is the real skill now. Not writing code. Writing context.
            </p>
          </section>

          <hr className="border-border" />

          {/* If You Want to Try This */}
          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">If You Want to Try This</h2>
            <p className="leading-relaxed">
              Here&apos;s the process:
            </p>
            <ol className="mt-4 space-y-3">
              <li><strong>Talk through your idea.</strong> Use Claude (or a human) as a thinking partner. Stress-test your assumptions. Make decisions.</li>
              <li><strong>Write a PRD.</strong> What are you building? User flow? Constraints? Tech stack? Be specific.</li>
              <li><strong>Write a design doc.</strong> Typography, colors, spacing, vibe. Include explicit don&apos;ts.</li>
              <li><strong>Write examples.</strong> If there&apos;s AI-generated content, show what good looks like.</li>
              <li><strong>Write your prompts.</strong> System prompts for any AI features. These live in the codebase.</li>
              <li><strong>Write the Claude Code prompt.</strong> Reference your context files. Break work into steps with pause points.</li>
              <li><strong>Let it build.</strong> Point Claude Code at the context and let it work.</li>
            </ol>
            <p className="leading-relaxed mt-6">
              The context is the product now. Write it well.
            </p>
          </section>

          <hr className="border-border" />

          {/* The Prompt */}
          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">The Prompt</h2>
            <p className="leading-relaxed mb-6">
              Here&apos;s the exact prompt I used to kick off the build. Copy it, adapt it for your own project, and see what happens.
            </p>
            <CodeBlock
              code={CLAUDE_CODE_PROMPT}
              title="Claude Code Prompt"
              language="markdown"
            />
          </section>

          {/* Fine Print */}
          <section className="pt-6 mt-6 border-t border-border">
            <p className="text-muted-foreground text-sm italic">
              Built with{' '}
              <a
                href="https://code.claude.com/docs/en/overview"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-2 hover:text-primary transition-colors"
              >
                Claude Code
              </a>
              . The context documents are in the repo if you want to see what Claude was working from.
            </p>
          </section>
        </article>

        {/* CTA */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg" className="font-serif text-lg px-8">
              Try GUT &rarr;
            </Button>
          </Link>
          <Link href="/about">
            <Button size="lg" variant="outline" className="font-serif text-lg px-8">
              What is GUT?
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
