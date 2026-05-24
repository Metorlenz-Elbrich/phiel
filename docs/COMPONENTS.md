# Composants — PhiBrain Inc

Inventaire de tous les composants React et Three.js du projet, avec leurs props, dépendances et points clés.

## A. Composants UI réutilisables (`components/ui/`)

### `Button` — `components/ui/button.tsx`
Bouton polymorphique (`<button>` ou `<a>`).
- **Props** : `variant?: "primary" | "secondary" | "ghost" | "outline"` (def. `primary`), `size?: "sm" | "md" | "lg"` (def. `md`), `as?: "button" | "a"`, autres HTMLAttrs natives, `className?`.
- **États** : hover (translateY -2px, brightness 110), focus-visible (outline cyan), disabled (opacity 50, pointer-events none).
- **Dark/Light** : variantes `secondary`, `ghost`, `outline` lisent `--surface`, `--surface-muted`, `--border` (deux modes).
- **Dépendances** : `cn` (`lib/utils.ts`).

### `Card` — `components/ui/card.tsx`
Carte avec bord, fond surface, et overlay gradient au survol si `interactive`.
- **Props** : `interactive?: boolean`, `className?`, autres HTMLAttrs `<div>`.
- **Dark/Light** : `bg-[color:var(--surface)]`, `border-[color:var(--border)]`.

### `Icon` — `components/ui/icon.tsx`
16 icônes SVG inline (pas de dépendance externe).
- **Props** : `name: IconName` (cf. fichier), `size?: number` (def. 20), `className?`.
- **Icônes** : `github`, `linkedin`, `twitter`, `instagram`, `mail`, `phone`, `mapPin`, `sun`, `moon`, `arrowRight`, `external`, `menu`, `close`, `code`, `palette`, `smartphone`, `sparkle`, `check`.

### `Logo` — `components/ui/logo.tsx`
Switche entre `/phibrain-logo.png` (dark) et `/phibrain-logo-light-transparent.png` (light) via `useTheme()`.
- **Props** : `height?: number` (def. 40), `priority?: boolean` (def. false).
- **Dépendances** : `next/image`, `next-themes`.

### `ThemeToggle` — `components/ui/theme-toggle.tsx`
Bouton soleil/lune animé. Crossfade + rotation 0.5s.
- **Props** : `className?`.
- **A11y** : `role="switch"`, `aria-checked`, `aria-label` contextuel, `sr-only`.

### `NavBar` — `components/ui/nav-bar.tsx`
Header sticky, blur au scroll, burger mobile.
- **Liens** : `lib/data.ts → NAV_LINKS`.
- **État local** : `scrolled` (>8px), `open` (menu mobile, verrouille `body.overflow`).
- **Inclut** : `Logo`, `ThemeToggle`, lien CTA "Discuter du projet", `Icon menu|close`.

### `Footer` — `components/ui/footer.tsx`
Pied de page : description, socials, navigation, contact direct.
- **Lit** : `SITE`, `NAV_LINKS`, `SOCIALS` (data.ts).

## B. Composants Three.js (`components/three/`)

### `rng.ts`
Générateur déterministe mulberry32. Garantit que les positions des nœuds/traces sont identiques entre SSR et CSR (zéro hydratation mismatch).

### `CircuitHemisphere` — `components/three/CircuitHemisphere.tsx`
Hémisphère gauche, circuits imprimés.
- **Props** : `count?: number` (def. 14 traces).
- **Render** : `<lineSegments>` (BufferGeometry), boîtes `<mesh>` aux nœuds, sphères animées (particules cyan), `<pointLight>` faibles aux points de départ.
- **Animation** : `useFrame` — déplace chaque particule le long de sa trace (cumulative distances), pulse de scale.
- **Couleurs** : `#0066cc` (lignes/nœuds), `#00d4ff` (particules + points lumineux).

### `NeuronHemisphere` — `components/three/NeuronHemisphere.tsx`
Hémisphère droit, réseau neuronal.
- **Props** : `count?: number` (def. 36 neurones).
- **Algo** : positions sphériques aléatoires (PRNG), connexions aux ~3 plus proches voisins.
- **Animation** : `useFrame` — `emissiveIntensity` pulse par neurone, sphère lumineuse "synapse" qui voyage le long de chaque arête (k=0..1).
- **Couleurs** : `#00d4ff` (neurones), `#80e6ff` (impulsions).

### `BrainScene` — `components/three/BrainScene.tsx`
Compose les deux hémisphères dans un `<group>` partagé.
- **Props** : `prefersReducedMotion: boolean`, `pointerEnabled: boolean`.
- **Animation** : auto-rotation Y (delta × 0.12 rad/s), suivi souris ±15° (lerp 0.06 sur X, 0.04 sur Z).
- **Sphère wireframe** : enveloppe légère pour rappeler la silhouette du cerveau (opacity 0.04).

### `BrainCanvas` — `components/three/BrainCanvas.tsx`
Wrapper du `<Canvas>` R3F.
- **Hooks** : `useReducedMotion()`, `useIsCoarsePointer()` (matchMedia).
- **Canvas** : `dpr={[1, coarse ? 1.5 : 2]}`, caméra `[0, 0, 7.2]`, fov 45, `alpha: true`, `powerPreference: "high-performance"`.
- **Lights** : `ambient` 0.35 + 2 `directional` (rim cyan / fill bleu).
- **Suspense** : fallback `null` (le loading visuel est dans le `dynamic()` côté Hero).

## C. Sections (`components/sections/`)

### `SectionHeading` — `section-heading.tsx`
- **Props** : `eyebrow?`, `title: ReactNode`, `description?`, `align?: "left" | "center"`, `className?`.

### `HeroSection` — `hero-section.tsx`
- **Imports** : `BrainCanvas` (dynamic, ssr false).
- **Overlay** : `bg-[color:var(--hero-overlay)]` + radial vignette vers `var(--background)`.
- **Layers** : canvas z-0, overlays z-1, contenu z-10.
- **CTA** : "Démarrer un projet" (#contact), "Voir nos réalisations" (#portfolio).

### `ServicesSection` — `services-section.tsx`
- **Source** : `SERVICES` (data.ts), icônes mappées via `ICONS: Record<ServiceIcon, IconName>`.
- **Cards** : `<Card interactive>` avec icône, titre, description, features cochées.

### `SkillsSection` — `skills-section.tsx`
- **Source** : `SKILLS`, regroupées en 4 catégories (`Front-end`, `Back-end`, `Mobile`, `Design`).
- **Barre de niveau** : `motion.div` animée de `0%` → `level%`.

### `StatsSection` — `stats-section.tsx`
- **Counter** : `useInView` (Framer) + `requestAnimationFrame` (easing cubic-out).
- **Bloc** : container glow (radial cyan/bleu).

### `PortfolioSection` — `portfolio-section.tsx`
- **State** : `filter: PortfolioCategory`.
- **Animations** : `AnimatePresence mode="popLayout"` pour transitions entrée/sortie fluides.
- **Lien** : `link?` (site) + `repo?` (GitHub).

### `TeamSection` — `team-section.tsx`
- **Placeholders** : avatar = initiales sur fond gradient (`.bg-phi-gradient`).

### `TestimonialsSection` — `testimonials-section.tsx`
- **Carousel** : `setInterval(7000)` + boutons dots manuels.
- **Animation** : `AnimatePresence mode="wait"`.

### `ContactSection` — `contact-section.tsx`
- **Formulaire** : `name`, `email`, `subject`, `message` → ouvre `mailto:` avec `subject` + `body` pré-remplis.
- **Status** : `idle | sending | sent | error` (live region `aria-live="polite"`).

## D. Layout & data

### `app/layout.tsx`
- Charge Inter + Space Grotesk via `next/font/google`.
- Wraps `<ThemeProvider>` + `<NavBar>` + `<main>` + `<Footer>`.
- Exporte `metadata` + `viewport` (themeColor light/dark).

### `lib/data.ts`
Source unique pour : `SITE`, `NAV_LINKS`, `SOCIALS`, `SERVICES`, `SKILLS`, `STATS`, `PORTFOLIO`, `PORTFOLIO_FILTERS`, `TEAM`, `TESTIMONIALS`.

### `lib/utils.ts`
- `cn(...classes)` — join conditionnel de classes Tailwind.
