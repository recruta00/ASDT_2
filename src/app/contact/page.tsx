import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { ButtonAnchor } from "@/components/ui/Button";
import {
  WhatsAppIcon,
  PhoneIcon,
  MailIcon,
  PinIcon,
  ClockIcon,
  InstagramIcon,
} from "@/components/ui/icons";
import { whatsappUrl, generalMessage } from "@/lib/whatsapp";
import { routes } from "@/config/routes";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contactez Recruta Rent à ${site.city} : WhatsApp, téléphone, e-mail. Réponse rapide 7j/7 pour votre location de moto ou de séjour.`,
  alternates: { canonical: routes.contact },
};

export default function ContactPage() {
  const details = [
    {
      Icon: PhoneIcon,
      label: "Téléphone",
      value: site.phoneDisplay,
      href: `tel:${site.phoneDisplay.replace(/\s/g, "")}`,
    },
    { Icon: MailIcon, label: "E-mail", value: site.email, href: `mailto:${site.email}` },
    { Icon: PinIcon, label: "Adresse", value: site.address },
    { Icon: ClockIcon, label: "Horaires", value: site.openingHoursLabel },
    {
      Icon: InstagramIcon,
      label: "Instagram",
      value: "@recrutarent",
      href: site.instagramUrl,
    },
  ];

  return (
    <main id="main">
      <PageHeader
        breadcrumb={[{ label: "Accueil", href: routes.home }, { label: "Contact" }]}
        eyebrow="On vous répond vite"
        title="Parlons de votre location"
        lead="Le plus simple, c'est WhatsApp — mais choisissez le canal qui vous convient."
      />
      <Container className="pb-24 pt-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          {/* Huge WhatsApp CTA (primary) */}
          <div className="glow-ember texture-noise relative flex flex-col justify-center overflow-hidden rounded-[24px] border border-[color:var(--line)] bg-ink p-8 md:p-10">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-ember text-abyss">
              <WhatsAppIcon className="h-8 w-8" />
            </span>
            <h2 className="font-display mt-5 text-2xl font-bold text-bone">
              Écrivez-nous sur WhatsApp
            </h2>
            <p className="mt-2 text-mist">
              La façon la plus rapide de réserver ou de poser une question. {site.whatsappResponse}.
            </p>
            <ButtonAnchor
              href={whatsappUrl(generalMessage())}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              className="mt-6 self-start"
            >
              Ouvrir WhatsApp
            </ButtonAnchor>
          </div>

          {/* Other channels */}
          <ul className="grid gap-4 sm:grid-cols-2">
            {details.map(({ Icon, label, value, href }) => {
              const inner = (
                <div className="card-glass h-full p-6">
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-[color:var(--line)] text-ember">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="font-spec mt-4 text-mist">{label}</p>
                  <p className="mt-1 text-bone">{value}</p>
                </div>
              );
              return (
                <li key={label}>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="block h-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
                    >
                      {inner}
                    </a>
                  ) : (
                    inner
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Map embed — appears only when a Google Maps embed URL is set in
            src/config/site.ts (site.mapEmbedUrl). Left empty by default. */}
        {site.mapEmbedUrl ? (
          <div className="mt-10 overflow-hidden rounded-[24px] border border-[color:var(--line)]">
            <iframe
              src={site.mapEmbedUrl}
              title={`Localisation de ${site.name} à ${site.city}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[380px] w-full"
            />
          </div>
        ) : null}
      </Container>
    </main>
  );
}
