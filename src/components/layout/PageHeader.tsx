import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Breadcrumb, type Crumb } from "@/components/ui/Breadcrumb";

/**
 * Light page header band: bone surface, ink display title, ember Seam accents.
 * A hairline separates it from the page body.
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
  breadcrumb,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  breadcrumb?: Crumb[];
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-ink/10 bg-bone pb-14 pt-28 md:pb-18 md:pt-36">
      {/* Whisper of warmth in the corner — never in front of text. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_85%_0%,rgba(248,106,44,0.07),transparent_70%)]"
      />
      <Container className="relative">
        {breadcrumb ? <Breadcrumb items={breadcrumb} /> : null}
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h1 className="font-display mt-3 max-w-4xl text-[clamp(2.4rem,5vw,4rem)] font-bold leading-[1.05] text-ink">
          {title}
        </h1>
        {lead ? <p className="mt-5 max-w-2xl text-ink/70">{lead}</p> : null}
        {children}
      </Container>
    </header>
  );
}
