'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
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
        <header className="mb-12 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-normal mb-4">
            The Grand Unified Theory of Cooking
          </h1>
          <p className="text-muted-foreground text-xl">
            One framework. Every cuisine. Infinite dinners.
          </p>
        </header>

        {/* Content */}
        <article className="prose prose-neutral dark:prose-invert max-w-none space-y-12">
          {/* The Thesis */}
          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">The Thesis</h2>
            <p className="text-lg leading-relaxed">
              Thai curries, French braises, Mexican tacos, your grandmother&apos;s Sunday sauce — they all follow the same underlying structure. Five components, always. We call them the Five F&apos;s.
            </p>
          </section>

          {/* The Five F's */}
          <section>
            <h2 className="font-serif text-2xl font-normal mb-6">The Five F&apos;s</h2>

            <div className="space-y-6">
              <div className="p-5 rounded-lg bg-[var(--category-fat)] border border-[var(--category-fat-border)]">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Fat</span>
                <p className="text-sm text-muted-foreground/60 mb-2 italic">First in the pan</p>
                <p className="font-serif">Oil, butter, lard, ghee. The cooking medium that carries heat, blooms spices, and softens aromatics. Different fats signal different cuisines: olive oil says Mediterranean, coconut oil says Southeast Asia, schmaltz says Eastern Europe. Choose your fat and you&apos;ve already started telling a story.</p>
              </div>

              <div className="p-5 rounded-lg bg-[var(--category-foundation)] border border-[var(--category-foundation-border)]">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Foundation</span>
                <p className="text-sm text-muted-foreground/60 mb-2 italic">Builds the base</p>
                <p className="font-serif">The humble vegetables that make everything taste like itself. The French have mirepoix, Cajuns have the trinity, Italians use soffritto. Every cuisine figured out that certain combinations of alliums and aromatics create a flavor base that anchors a dish. Without foundation, food tastes like it&apos;s missing something you can&apos;t name.</p>
              </div>

              <div className="p-5 rounded-lg bg-[var(--category-feature)] border border-[var(--category-feature-border)]">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Feature</span>
                <p className="text-sm text-muted-foreground/60 mb-2 italic">The star</p>
                <p className="font-serif">The headline ingredient — the reason you made the dish. Chicken thighs. Short ribs. Cauliflower. Chickpeas. It&apos;s what you&apos;d put in the title if you were naming the meal. The protein, the main vegetable, the centerpiece that the other four F&apos;s orbit around.</p>
              </div>

              <div className="p-5 rounded-lg bg-[var(--category-flavor)] border border-[var(--category-flavor-border)]">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Flavor</span>
                <p className="text-sm text-muted-foreground/60 mb-2 italic">Brings it together</p>
                <p className="font-serif">The liquid that turns ingredients into a dish. Stock, wine, coconut milk, crushed tomatoes. This is where cuisine lives. Swap the flavor and you&apos;ve changed everything: the same chicken becomes Thai curry or coq au vin depending on what you reach for.</p>
              </div>

              <div className="p-5 rounded-lg bg-[var(--category-finish)] border border-[var(--category-finish-border)]">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Finish</span>
                <p className="text-sm text-muted-foreground/60 mb-2 italic">The final touch</p>
                <p className="font-serif">Brightness and balance, right before serving. A squeeze of lime, torn basil, a drizzle of good oil, a hit of vinegar. The difference between good and <em>really</em> good. Skip the finish and everything tastes flat. Add it and the whole dish wakes up.</p>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">The App</h2>
            <p className="leading-relaxed">
              Generate a meal. Lock what you like. Re-roll what you don&apos;t. Switch cuisines and watch your locked ingredients adapt — chicken thighs become cacciatore or green curry depending on where you point the dial. When it looks good, hit the button and get a recipe.
            </p>
          </section>

          {/* Why This Works */}
          <section>
            <h2 className="font-serif text-2xl font-normal mb-4">Why Five?</h2>
            <p className="leading-relaxed">
              Five isn&apos;t arbitrary — it&apos;s complete. Fat without finish tastes flat. Protein without foundation tastes like nothing. These aren&apos;t categories we invented; they&apos;re roles that ingredients play. Every cuisine figured this out independently. We just named it.
            </p>
          </section>

          {/* Fine Print */}
          <section className="pt-4 border-t">
            <p className="text-muted-foreground text-sm">
              Recipes are AI-generated. Ingredients are optimized for a normal grocery store. Everything is designed for a weeknight.
            </p>
          </section>
        </article>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link href="/">
            <Button size="lg" className="font-serif text-lg px-8">
              Start Cooking &rarr;
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
