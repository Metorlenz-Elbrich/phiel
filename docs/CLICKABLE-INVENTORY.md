# Inventaire exhaustif des éléments cliquables

Tous les éléments interactifs du site (liens, boutons, switches, contrôles). Chaque ligne précise : nom, composant, fichier:ligne, action, comportements (hover, active, focus, disabled), comportement dark / light.

> Les numéros de ligne sont indicatifs (peuvent dériver d'1 ou 2 lors d'éditions futures).

---

## 1. Navigation principale (NavBar)

| # | Élément | Composant | Fichier:ligne | Action | Hover / Active / Disabled | Dark / Light |
|---|---|---|---|---|---|---|
| 1.1 | Logo cliquable | `NavBar` | `components/ui/nav-bar.tsx:38` | `<Link href="#hero">` — scroll vers le top | hover : focus-visible outline cyan | Logo PNG switche : `phibrain-logo.png` (dark) ↔ `phibrain-logo-light-transparent.png` (light) |
| 1.2 | Lien "Accueil" | `NavBar` | `components/ui/nav-bar.tsx:48` | `<Link href="#hero">` | hover : text cyan + fond `--surface-muted` | Texte `foreground/80`, fond hover s'adapte |
| 1.3 | Lien "Services" | `NavBar` | `components/ui/nav-bar.tsx:48` | `<Link href="#services">` | idem | idem |
| 1.4 | Lien "Compétences" | `NavBar` | `components/ui/nav-bar.tsx:48` | `<Link href="#skills">` | idem | idem |
| 1.5 | Lien "Portfolio" | `NavBar` | `components/ui/nav-bar.tsx:48` | `<Link href="#portfolio">` | idem | idem |
| 1.6 | Lien "Équipe" | `NavBar` | `components/ui/nav-bar.tsx:48` | `<Link href="#team">` | idem | idem |
| 1.7 | Lien "Contact" | `NavBar` | `components/ui/nav-bar.tsx:48` | `<Link href="#contact">` | idem | idem |
| 1.8 | ThemeToggle (sun/moon) | `ThemeToggle` | `components/ui/theme-toggle.tsx:17` | Bascule `light` ↔ `dark` via next-themes | hover : border cyan + text cyan, focus-visible outline cyan, role=switch, aria-checked | Icône soleil (light) ↔ lune (dark) avec crossfade + rotation 0.5s |
| 1.9 | CTA "Discuter du projet" (desktop) | `NavBar` | `components/ui/nav-bar.tsx:59` | `<Link href="#contact">` | hover : brightness 110, shadow cyan | Fond `bg-phi-gradient`, texte blanc dans les deux modes |
| 1.10 | Bouton burger (mobile) | `NavBar` | `components/ui/nav-bar.tsx:67` | Toggle menu mobile (`open` state) | hover : border cyan, aria-expanded mis à jour | Border `--border`, icône `Icon name="menu"|"close"` |
| 1.11 | Liens mobile (×6) + CTA | `NavBar` | `components/ui/nav-bar.tsx:85` | `<Link>` ferme le menu et scroll vers ancre | hover : text cyan, fond `--surface-muted` | Fond `--surface/95` + backdrop blur |

---

## 2. Hero

| # | Élément | Composant | Fichier:ligne | Action | Hover / Active / Disabled | Dark / Light |
|---|---|---|---|---|---|---|
| 2.1 | CTA "Démarrer un projet" | `HeroSection` | `components/sections/hero-section.tsx:67` | `<Link href="#contact">` | hover : brightness 110 + translate -2px + shadow cyan | Gradient `phi-gradient` (cyan→bleu), texte blanc |
| 2.2 | CTA "Voir nos réalisations" | `HeroSection` | `components/sections/hero-section.tsx:74` | `<Link href="#portfolio">` | hover : border cyan + text cyan | Border `--border-strong`, fond `--surface/60` + blur (adapté aux 2 modes) |
| 2.3 | Cerveau 3D (Canvas) | `BrainCanvas` | `components/three/BrainCanvas.tsx:32` | Pas de clic — réagit au mouvement souris (pointer.x/y) sur desktop (`pointer: fine`) | Sur `pointer: coarse` (mobile) : auto-rotation seule | `<color attach="background" />` transparent. L'overlay (`--hero-overlay`) change : rgba(10,10,10,0.62) dark / rgba(248,249,250,0.55) light |

---

## 3. Services

| # | Élément | Composant | Fichier:ligne | Action | Hover / Active / Disabled | Dark / Light |
|---|---|---|---|---|---|---|
| 3.1 | Carte "Branding & Identité" | `ServicesSection` | `components/sections/services-section.tsx:39` | Aucun lien (carte décorative) | hover : translate -4px, border cyan/60, shadow cyan, overlay gradient soft | `--surface` + `--border` |
| 3.2 | Carte "Sites & Plateformes Web" | idem | idem | idem | idem | idem |
| 3.3 | Carte "Apps Mobiles" | idem | idem | idem | idem | idem |

---

## 4. Compétences (Skills)

Aucun élément cliquable — barres de progression animées au scroll (`whileInView`).

---

## 5. Statistiques

Aucun élément cliquable — compteurs animés (`useInView` + RAF).

---

## 6. Portfolio

| # | Élément | Composant | Fichier:ligne | Action | Hover / Active / Disabled | Dark / Light |
|---|---|---|---|---|---|---|
| 6.1 | Filtre "Tous" | `PortfolioSection` | `components/sections/portfolio-section.tsx:28` | `setFilter("Tous")` | active (aria-pressed=true) : gradient + shadow cyan / inactive : hover border cyan, text cyan | Active : gradient ; inactive : `--border` |
| 6.2 | Filtre "Apps" | idem | idem | `setFilter("Apps")` | idem | idem |
| 6.3 | Filtre "Design" | idem | idem | `setFilter("Design")` | idem | idem |
| 6.4 | Filtre "Sites" | idem | idem | `setFilter("Sites")` | idem | idem |
| 6.5 | Cartes projets (×8) | `PortfolioSection` | `components/sections/portfolio-section.tsx:55` | Aucun clic sur la carte elle-même | hover : translate -4px, border cyan, shadow, overlay gradient soft | `--surface` |
| 6.6 | Lien "Voir le projet" (par carte, si `link`) | `PortfolioSection` | `components/sections/portfolio-section.tsx:91` | `<a target="_blank">` | hover : underline | Text cyan dans les 2 modes |
| 6.7 | Lien GitHub (par carte, si `repo`) | `PortfolioSection` | `components/sections/portfolio-section.tsx:100` | `<a target="_blank">` vers repo GitHub | hover : text cyan | Text `foreground/70`, icône SVG inline |

---

## 7. Équipe

| # | Élément | Composant | Fichier:ligne | Action | Hover / Active / Disabled | Dark / Light |
|---|---|---|---|---|---|---|
| 7.1 | Cartes membres (×4) | `TeamSection` | `components/sections/team-section.tsx:31` | Aucun clic carte | hover : translate -4px, border cyan, shadow, overlay | `--surface` |
| 7.2 | Lien LinkedIn par membre | `TeamSection` | `components/sections/team-section.tsx:46` | `<a target="_blank">` | hover : text cyan + border cyan | Rond `--border` |

---

## 8. Témoignages

| # | Élément | Composant | Fichier:ligne | Action | Hover / Active / Disabled | Dark / Light |
|---|---|---|---|---|---|---|
| 8.1 | Carousel auto (7 s) | `TestimonialsSection` | `components/sections/testimonials-section.tsx:11` | Avance automatique du témoignage | — | — |
| 8.2 | Dots de navigation (×3) | `TestimonialsSection` | `components/sections/testimonials-section.tsx:65` | `setIdx(i)` — passe à un témoignage | hover (inactif) : bg phi-cyan/60 — actif : pill 32px gradient | Inactif `--border-strong`, actif gradient |

---

## 9. Contact

| # | Élément | Composant | Fichier:ligne | Action | Hover / Active / Disabled | Dark / Light |
|---|---|---|---|---|---|---|
| 9.1 | Carte email | `ContactSection` | `components/sections/contact-section.tsx:53` | `<a href="mailto:phibraininc@gmail.com">` | hover : border cyan + text cyan | `--surface` + `--border` |
| 9.2 | Téléphone 1 | `ContactSection` | `components/sections/contact-section.tsx:70` | `<a href="tel:+237696415759">` | hover : text cyan | idem |
| 9.3 | Téléphone 2 | `ContactSection` | `components/sections/contact-section.tsx:70` | `<a href="tel:+237657235596">` | idem | idem |
| 9.4 | Cartes localisation | `ContactSection` | `components/sections/contact-section.tsx:85` | Décorative | — | idem |
| 9.5 | Réseaux sociaux (×4) | `ContactSection` | `components/sections/contact-section.tsx:97` | `<a target="_blank">` GitHub / LinkedIn / Twitter / Instagram | hover : text cyan + border cyan | Rond `--border` |
| 9.6 | Input "Nom complet" | `ContactSection` (Field) | `components/sections/contact-section.tsx:131` | Required text input | focus : border phi-cyan + ring cyan/30 | Fond `--surface-muted`, border `--border` |
| 9.7 | Input "Email" | idem | idem | Required email input | idem | idem |
| 9.8 | Input "Sujet" | idem | idem | Text input optionnel | idem | idem |
| 9.9 | Textarea "Votre message" | idem | idem | Required textarea (5 rows) | idem | idem |
| 9.10 | Bouton "Envoyer le message" | `ContactSection` | `components/sections/contact-section.tsx:124` | `type=submit` → ouvre `mailto:` pré-rempli | hover : brightness 110, disabled (sending) : opacity 60 + pointer-events none | Gradient cyan/bleu (2 modes) |

---

## 10. Footer

| # | Élément | Composant | Fichier:ligne | Action | Hover / Active / Disabled | Dark / Light |
|---|---|---|---|---|---|---|
| 10.1 | Logo | `Footer` | `components/ui/footer.tsx:13` | — (image décorative) | — | switche selon thème (cf. 1.1) |
| 10.2 | Socials (×4) | `Footer` | `components/ui/footer.tsx:19` | `<a target="_blank">` | hover : text cyan + border cyan | Rond `--border` |
| 10.3 | Liens nav (×6) | `Footer` | `components/ui/footer.tsx:39` | `<Link href="#…">` | hover : text cyan | `foreground/70` |
| 10.4 | Lien email | `Footer` | `components/ui/footer.tsx:54` | `<a href="mailto:">` | hover : text cyan | idem |
| 10.5 | Téléphones (×2) | `Footer` | `components/ui/footer.tsx:60` | `<a href="tel:">` | hover : text cyan | idem |

---

## Récapitulatif

- **Liens internes** (#ancres) : 14 (6 nav desktop + 6 nav mobile + 1 logo + 1 CTA + 2 CTA hero + variantes footer)
- **Liens externes** (`target="_blank"`) : socials + LinkedIn équipe + repos GitHub portfolio
- **Boutons d'action** : 1 toggle thème, 1 burger, 4 filtres portfolio, 3 dots témoignages, 1 submit formulaire
- **Champs de formulaire** : 4 (3 inputs + 1 textarea)
- **Auto-comportements (non-cliquables)** : auto-rotation 3D, hover souris 3D, autoplay carousel témoignages
