# Architecture — PhiBrain Inc

Site vitrine de l'agence PhiBrain Inc. App Router Next.js 16 (16.2.x), TypeScript strict, Tailwind CSS v4, Framer Motion, React Three Fiber.

> Note : `create-next-app@latest` installe Next.js 16 (l'évolution majeure de Next.js 15). Toutes les conventions App Router restent identiques pour ce projet : composants serveur par défaut, file-based routing, conventions `metadata`, `sitemap`, `robots`.

## 1. Stack

| Domaine          | Choix                                                        |
| ---------------- | ------------------------------------------------------------ |
| Framework        | Next.js 16 (App Router, Turbopack par défaut)                |
| Langage          | TypeScript 5                                                 |
| UI / styles      | Tailwind CSS v4 (config CSS via `@theme`)                    |
| Thème            | `next-themes` (mode système + persistance localStorage)      |
| Animations 2D    | Framer Motion 12                                             |
| Animations 3D    | `@react-three/fiber` + `@react-three/drei` + `three`         |
| Polices          | Space Grotesk (titres) + Inter (corps) via `next/font`       |
| Déploiement      | Vercel (zéro-config)                                         |

## 2. Arborescence

```
phibrain-site/
├── app/
│   ├── layout.tsx              # Root layout, metadata, ThemeProvider, fonts
│   ├── page.tsx                # Page d'accueil (composition des 8 sections)
│   ├── globals.css             # Tailwind v4 + tokens design (couleurs, fonts, keyframes)
│   ├── sitemap.ts              # Génération sitemap.xml
│   └── robots.ts               # Génération robots.txt
├── components/
│   ├── theme-provider.tsx      # Wrapper next-themes (class strategy)
│   ├── ui/
│   │   ├── button.tsx          # Bouton polymorphique (button|a) avec variantes
│   │   ├── card.tsx            # Carte hover gradient
│   │   ├── icon.tsx            # SVG inline (16 icônes)
│   │   ├── logo.tsx            # Switch logo dark/light selon le thème
│   │   ├── nav-bar.tsx         # Navbar sticky blur + burger mobile
│   │   ├── footer.tsx          # Pied de page (liens, contact, socials)
│   │   └── theme-toggle.tsx    # Toggle soleil/lune animé
│   ├── three/
│   │   ├── BrainCanvas.tsx     # Wrapper Canvas R3F (client-only)
│   │   ├── BrainScene.tsx      # Scène : group + rotation auto + souris
│   │   ├── CircuitHemisphere.tsx  # Hémisphère PCB (gauche)
│   │   ├── NeuronHemisphere.tsx   # Hémisphère neuronal (droit)
│   │   └── rng.ts              # PRNG déterministe (mulberry32)
│   └── sections/
│       ├── section-heading.tsx
│       ├── hero-section.tsx           # 2. Hero + cerveau 3D
│       ├── services-section.tsx       # 3. Services
│       ├── skills-section.tsx         # 4. Compétences
│       ├── stats-section.tsx          # 5. Statistiques
│       ├── portfolio-section.tsx      # 6. Portfolio + filtres
│       ├── team-section.tsx           # 7. Équipe
│       ├── testimonials-section.tsx   # 8. Témoignages
│       └── contact-section.tsx        # 9. Contact + formulaire
├── lib/
│   ├── data.ts                 # Contenu statique centralisé
│   └── utils.ts                # cn() helper
├── public/
│   ├── phibrain-logo.png                   # Dark mode
│   ├── phibrain-logo-light-transparent.png # Light mode
│   └── phibrain-logo-light.png             # Backup
├── docs/                       # Cette documentation
└── package.json
```

## 3. Composants serveur vs client

- **Serveur par défaut** : `app/layout.tsx`, `app/page.tsx`, `app/sitemap.ts`, `app/robots.ts`, `components/sections/section-heading.tsx`, `components/ui/card.tsx`, `components/ui/icon.tsx`.
- **Client (`"use client"`)** : tout ce qui touche au DOM, au thème, à l'état ou à Three.js : `theme-provider`, `nav-bar`, `footer`, `logo`, `theme-toggle`, `button`, toutes les sections animées, tous les composants `three/`.

## 4. Tailwind v4 — config CSS

Tailwind v4 abandonne `tailwind.config.ts`. Tout passe par CSS via `@theme` dans `app/globals.css`. Variant `dark` est défini en mode classe pour fonctionner avec `next-themes` (qui pose `class="dark"` sur `<html>`) :

```css
@custom-variant dark (&:where(.dark, .dark *));
```

Tokens définis :
- Couleurs : `--color-bg-dark`, `--color-bg-light`, `--color-phi-cyan`, `--color-phi-blue`…
- Variables runtime (par mode) : `--background`, `--foreground`, `--surface`, `--surface-muted`, `--border`, `--hero-overlay`.
- Fonts : `--font-display` (Space Grotesk), `--font-sans` (Inter).
- Keyframes : `fade-in`, `shimmer`, `pulse-soft`.
- Réduction de motion via `@media (prefers-reduced-motion: reduce)`.

## 5. Three.js — pourquoi cette architecture

| Fichier               | Rôle                                                                 |
| --------------------- | -------------------------------------------------------------------- |
| `rng.ts`              | Générateur déterministe — positions identiques entre SSR / runs      |
| `CircuitHemisphere`   | Trace PCB : nœuds carrés + lignes droites + particule cyan qui flux  |
| `NeuronHemisphere`    | Sphères neurales + arêtes vers k-plus proches voisins + pulsations   |
| `BrainScene`          | Compose les deux hémisphères, gère rotation auto + suivi souris      |
| `BrainCanvas`         | Wrapper `<Canvas>` (R3F), DPR adaptatif, lights, suspense            |

Le `BrainCanvas` est **importé en lazy** depuis le Hero :

```ts
const BrainCanvas = dynamic(() => import("@/components/three/BrainCanvas"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 animate-pulse …" />,
});
```

Raisons :
1. Three.js touche `window` → casse en SSR.
2. Le bundle Three (~600 ko) reste séparé du critical path.
3. Fallback dégradé animé évite un trou visuel.

## 6. next-themes

`components/theme-provider.tsx` enveloppe l'app :

```tsx
<NextThemesProvider
  attribute="class"           // pose .dark sur <html>
  defaultTheme="system"       // respect prefers-color-scheme
  enableSystem
  storageKey="phibrain-theme" // persistance localStorage
>
```

Le `<html>` porte `suppressHydrationWarning` car next-themes ajoute la classe côté client.

## 7. Accessibilité

- `prefers-reduced-motion` désactive globalement les transitions/keyframes (et l'auto-rotation 3D).
- Focus visibles uniformes (`:focus-visible` → outline cyan).
- `aria-label`, `aria-controls`, `aria-pressed`, `role="switch"` sur le toggle.
- Contraste : texte foncé sur clair (#111 / #f8f9fa) et clair sur foncé (#fff / #0a0a0a) → WCAG AA garanti.

## 8. SEO

- `app/layout.tsx` → `metadata` + `viewport` + Open Graph + Twitter card + favicon.
- `app/sitemap.ts` → génère `/sitemap.xml` (page d'accueil + ancres).
- `app/robots.ts` → génère `/robots.txt` (allow + sitemap).
- Polices Google chargées via `next/font` (auto-host, zéro CLS).

## 9. Performance

- Composants 3D en lazy (`ssr: false`).
- `next/image` pour les logos (auto-WebP/AVIF, sizes).
- DPR limité à `1.5` sur pointer coarse (mobile).
- Lights minimales (1 ambient + 2 directional + spots ponctuels).
- BufferGeometry pour les lignes (pas de Mesh par segment).

## 10. Scripts npm

```bash
npm run dev    # serveur dev (Turbopack)
npm run build  # build production
npm run start  # serveur production
```
