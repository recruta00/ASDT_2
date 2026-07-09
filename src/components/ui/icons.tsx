import type { SVGProps } from "react";

export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.8 14.16c-.24.68-1.42 1.32-1.94 1.36-.5.05-.97.23-3.28-.68-2.77-1.09-4.53-3.92-4.67-4.1-.14-.18-1.12-1.49-1.12-2.84s.71-2.02.96-2.29c.25-.27.55-.34.73-.34.18 0 .37 0 .53.01.17.01.4-.06.62.48.24.57.82 1.98.89 2.12.07.14.12.31.02.49-.09.18-.14.29-.28.45-.14.16-.29.36-.42.48-.14.14-.28.29-.12.57.16.28.72 1.19 1.55 1.93 1.07.95 1.96 1.25 2.24 1.39.28.14.44.12.6-.07.18-.21.69-.8.87-1.08.18-.28.36-.23.61-.14.25.09 1.58.75 1.85.89.27.14.45.21.52.32.07.12.07.66-.17 1.34Z" />
    </svg>
  );
}

const stroke: SVGProps<SVGSVGElement> = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function PhoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...props}>
      <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L19 13l1 6-.5.5a2 2 0 0 1-1.8.5A16 16 0 0 1 4.5 6.3 2 2 0 0 1 5 4.5Z" />
    </svg>
  );
}

export function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export function PinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...props}>
      <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
