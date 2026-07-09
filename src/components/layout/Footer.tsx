import Link from "next/link";
import { footerNav } from "@/config/routes";
import { site } from "@/config/site";
import { Logo } from "@/components/ui/Logo";
import { whatsappUrl, generalMessage } from "@/lib/whatsapp";

/** Footer — warm-dark espresso band; links every page + agency contact. */
export function Footer() {
  return (
    <footer className="band-dark mt-auto">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="max-w-xs">
            <Logo light />
            <p className="mt-4 text-sm text-abyss/75">{site.tagline}</p>
            <p className="mt-4 font-spec text-gold">
              {site.city} · {site.country}
            </p>
          </div>

          {footerNav.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <p className="font-spec text-abyss/60">{group.title}</p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-abyss/75 transition-colors hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-abyss/15 pt-6 text-sm text-abyss/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}. Tous droits réservés.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href={whatsappUrl(generalMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-gold"
            >
              WhatsApp
            </a>
            <a
              href={`tel:${site.phoneDisplay.replace(/\s/g, "")}`}
              className="transition-colors hover:text-gold"
            >
              {site.phoneDisplay}
            </a>
            <a href={`mailto:${site.email}`} className="transition-colors hover:text-gold">
              {site.email}
            </a>
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-gold"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
