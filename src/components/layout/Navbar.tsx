"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { primaryNav, routes } from "@/config/routes";
import { cx } from "@/lib/cx";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";

/** Sticky glass navbar: transparent over hero → blur + hairline after 80px (§5.5). */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on route change — React-recommended render-time
  // adjustment (avoids a setState-in-effect and an extra paint).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || menuOpen
          ? "border-b border-[color:var(--line)] bg-abyss/80 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <nav
        aria-label="Navigation principale"
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 md:px-8"
      >
        <Logo />

        <ul className="hidden items-center gap-7 lg:flex">
          {primaryNav.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cx(
                    "text-sm transition-colors hover:text-bone",
                    active ? "text-bone" : "text-mist",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <ButtonLink href={routes.book} size="md" className="hidden sm:inline-flex">
            Réserver
          </ButtonLink>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-[color:var(--line)] text-bone lg:hidden"
          >
            <span aria-hidden className="text-lg">
              {menuOpen ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="border-t border-[color:var(--line)] bg-abyss/95 px-5 py-4 lg:hidden"
      >
        <ul className="flex flex-col gap-1">
          {primaryNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block rounded-lg px-3 py-3 text-base text-bone hover:bg-bone/5"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="mt-2">
            <ButtonLink href={routes.book} className="w-full">
              Réserver
            </ButtonLink>
          </li>
        </ul>
      </div>
    </header>
  );
}
