import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Breadcrumb, type Crumb } from "@/components/ui/Breadcrumb";

/**
 * Dark page header band. Keeps the (light-on-dark) navbar legible on inner
 * pages whose body is a light --bone section, and carries the h1.
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
    <header className="texture-noise glow-ember relative overflow-hidden bg-abyss pb-16 pt-32 md:pb-20 md:pt-40">
      <Container>
        {breadcrumb ? <Breadcrumb items={breadcrumb} /> : null}
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h1 className="font-display mt-3 max-w-4xl text-[clamp(2.4rem,5vw,4rem)] font-bold leading-[1.05] text-bone">
          {title}
        </h1>
        {lead ? <p className="mt-5 max-w-2xl text-mist">{lead}</p> : null}
        {children}
      </Container>
    </header>
  );
}
