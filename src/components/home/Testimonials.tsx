import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { ButtonAnchor } from "@/components/ui/Button";
import { testimonials } from "@/data/testimonials";
import { site } from "@/config/site";

/** Format "2026-04" as "avril 2026" for display. */
function formatMonth(date: string): string {
  const [y, m] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
  }).format(new Date(y, (m ?? 1) - 1, 1));
}

/**
 * Social proof — renders ONLY when real reviews exist (data/testimonials.ts),
 * so the site never ships fabricated quotes. The Google link appears once
 * `site.googleReviewsUrl` is set.
 */
export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section aria-labelledby="reviews-title" className="py-20 md:py-28">
      <Container>
        <SectionHeader
          eyebrow="Ils ont roulé & séjourné avec nous"
          title="Des clients qui reviennent"
          titleId="reviews-title"
          align="center"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 6).map((t, i) => (
            <MotionReveal key={`${t.name}-${t.date}`} delay={i * 0.06}>
              <figure className="card-glass flex h-full flex-col p-7">
                <blockquote className="flex-1 text-ink/80">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5">
                  <span className="font-display block text-sm font-bold text-ink">
                    {t.name}
                    {t.origin ? (
                      <span className="font-sans font-normal text-ink/60">
                        {" "}
                        · {t.origin}
                      </span>
                    ) : null}
                  </span>
                  <span className="font-spec mt-1 block text-ink/60">
                    {t.context ? `${t.context} · ` : ""}
                    {formatMonth(t.date)}
                  </span>
                </figcaption>
              </figure>
            </MotionReveal>
          ))}
        </div>
        {site.googleReviewsUrl ? (
          <div className="mt-10 text-center">
            <ButtonAnchor
              href={site.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
            >
              Voir tous les avis sur Google
            </ButtonAnchor>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
