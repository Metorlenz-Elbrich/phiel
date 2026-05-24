import type { SVGProps } from "react";

type IconName =
  | "github"
  | "linkedin"
  | "twitter"
  | "instagram"
  | "mail"
  | "phone"
  | "mapPin"
  | "sun"
  | "moon"
  | "arrowRight"
  | "external"
  | "menu"
  | "close"
  | "code"
  | "palette"
  | "smartphone"
  | "sparkle"
  | "check";

const PATHS: Record<IconName, React.ReactNode> = {
  github: (
    <path d="M12 .5a11.5 11.5 0 0 0-3.63 22.42c.58.11.79-.25.79-.55v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.45.11-3.03 0 0 .96-.31 3.15 1.18.91-.25 1.89-.38 2.86-.39.97.01 1.94.14 2.86.39 2.18-1.49 3.14-1.18 3.14-1.18.63 1.58.24 2.74.12 3.03.74.8 1.18 1.83 1.18 3.08 0 4.4-2.69 5.36-5.25 5.65.41.35.77 1.05.77 2.13v3.16c0 .3.21.66.79.55A11.5 11.5 0 0 0 12 .5z" />
  ),
  linkedin: (
    <>
      <path d="M4.98 3.5A2.5 2.5 0 1 1 4.98 8.5 2.5 2.5 0 0 1 4.98 3.5z" />
      <path d="M3 9.75h4v11.25H3V9.75zM9 9.75h3.84v1.54h.05c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.66 4.8 6.12V21H17.7v-5.25c0-1.25-.02-2.86-1.74-2.86-1.74 0-2.01 1.36-2.01 2.77V21H10.13V9.75H9z" />
    </>
  ),
  twitter: (
    <path d="M18.244 3H21l-6.49 7.42L22 21h-6.828l-4.56-5.96L5.2 21H2.44l6.95-7.95L2 3h6.91l4.13 5.46L18.244 3zm-2.39 16h1.51L7.23 4.94H5.6L15.854 19z" />
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  phone: (
    <path d="M4.5 3.75A2.25 2.25 0 0 1 6.75 1.5h1.61c.86 0 1.62.55 1.88 1.37l.77 2.39a1.97 1.97 0 0 1-.49 2l-1.18 1.18a13 13 0 0 0 5.96 5.96l1.18-1.18a1.97 1.97 0 0 1 2-.49l2.39.77a1.97 1.97 0 0 1 1.37 1.88v1.61a2.25 2.25 0 0 1-2.25 2.25C10.6 19.24 4.76 13.4 4.5 3.75z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  ),
  mapPin: (
    <>
      <path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="10" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <line x1="12" y1="2" x2="12" y2="4" />
        <line x1="12" y1="20" x2="12" y2="22" />
        <line x1="2" y1="12" x2="4" y2="12" />
        <line x1="20" y1="12" x2="22" y2="12" />
        <line x1="4.5" y1="4.5" x2="6" y2="6" />
        <line x1="18" y1="18" x2="19.5" y2="19.5" />
        <line x1="4.5" y1="19.5" x2="6" y2="18" />
        <line x1="18" y1="6" x2="19.5" y2="4.5" />
      </g>
    </>
  ),
  moon: (
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" fill="currentColor" />
  ),
  arrowRight: (
    <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  ),
  external: (
    <path d="M14 4h6v6M20 4l-9 9M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  ),
  menu: (
    <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  ),
  close: (
    <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  ),
  code: (
    <path d="M8 6l-6 6 6 6M16 6l6 6-6 6M14 4l-4 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  ),
  palette: (
    <>
      <path d="M12 3a9 9 0 1 0 0 18c1.66 0 2-1.34 2-3 0-1.66 1.34-3 3-3h2a4 4 0 0 0 4-4 9 9 0 0 0-11-8z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="7.5" cy="10" r="1.2" fill="currentColor" />
      <circle cx="12" cy="7" r="1.2" fill="currentColor" />
      <circle cx="16.5" cy="10" r="1.2" fill="currentColor" />
    </>
  ),
  smartphone: (
    <>
      <rect x="6" y="2.5" width="12" height="19" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <line x1="11" y1="18.5" x2="13" y2="18.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  sparkle: (
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zm7 9l.8 2.4L22 15l-2.2.6L19 18l-.8-2.4L16 15l2.2-.6L19 12z" fill="currentColor" />
  ),
  check: (
    <path d="M5 12l5 5 9-11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  ),
};

export function Icon({
  name,
  className,
  size = 20,
  ...rest
}: { name: IconName; size?: number } & Omit<SVGProps<SVGSVGElement>, "name">) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}

export type { IconName };
