import Link from "next/link";
import { footerNav } from "@/config/routes";
import { site } from "@/config/site";
import { Logo } from "@/components/ui/Logo";
import { whatsappUrl, generalMessage } from "@/lib/whatsapp";

/** Footer — links every page (no orphans, spec §9.7) + agency contact. */
export function Footer() {
  return (
    <footer className="mt-auto border-t border-[color:var(--line)] bg-abyss">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm text-mist">{site.tagline}</p>
            <p className="mt-4 font-spec text-mist">
              {site.city} · {site.country}
            </p>
          </div>

          {footerNav.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <p className="font-spec text-bone/70">{group.title}</p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-mist transition-colors hover:text-bone"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[color:var(--line)] pt-6 text-sm text-mist sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}. Tous droits réservés.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href={whatsappUrl(generalMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-bone"
            >
              WhatsApp
            </a>
            <a href={`tel:${site.phoneDisplay.replace(/\s/g, "")}`} className="transition-colors hover:text-bone">
              {site.phoneDisplay}
            </a>
            <a href={`mailto:${site.email}`} className="transition-colors hover:text-bone">
              {site.email}
            </a>
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-bone"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
