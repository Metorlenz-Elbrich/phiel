# Guide du site — PhiBrain Inc

Comment modifier le contenu, la palette, le cerveau 3D et déployer le site.

## 0. Dashboard admin (MongoDB + NextAuth)

Le contenu peut être édité en ligne sur `/admin` (Services, Compétences,
Stats, Projets, Équipe, Témoignages). Le fichier `lib/data.ts` reste
utilisé comme **fallback** quand la DB est vide ou inaccessible.

### 0.1 Configurer MongoDB Atlas

1. Compte sur https://www.mongodb.com/atlas
2. Cluster free tier M0.
3. **Database Access** → créer un utilisateur dédié `phibrain-app` avec
   le rôle **readWrite sur la base `phibrain` uniquement**.
4. **Network Access** → whitelist les IPs sortantes Vercel ou
   `0.0.0.0/0` en dev.
5. **Connect → Drivers** → copier la connection string.

Détails sécurité : [`docs/SECURITY.md`](./SECURITY.md).

### 0.2 Configurer `.env.local`

Remplir `phibrain-site/.env.local` :

```bash
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=                  # cf. ci-dessous
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=admin@phibrain.com
ADMIN_PASSWORD=                   # ≥ 8 caractères, idéalement ≥ 12
```

Générer `NEXTAUTH_SECRET` (≥ 32 caractères) :

```sh
openssl rand -base64 32
```

### 0.3 Accéder au dashboard

```bash
npm run dev
# http://localhost:3000/admin/login
```

Login avec `ADMIN_EMAIL` / `ADMIN_PASSWORD`. Sur le Dashboard, cliquer
**"Initialiser depuis data.ts"** pour importer le contenu actuel dans
MongoDB (idempotent — n'écrase pas).

### 0.4 Déploiement Vercel

- Ajouter les 5 variables d'env dans **Vercel Dashboard → Settings →
  Environment Variables**. Marquer `NEXTAUTH_SECRET` et `MONGODB_URI`
  comme **Sensitive**.
- Mettre à jour `NEXTAUTH_URL` avec l'URL de prod.

> ⚠️ **GitHub Pages n'est plus supporté** : le site utilise désormais
> des API routes + auth + ISR, ce qui exige un runtime Node (Vercel
> ou équivalent).

---

## 1. Lancer en local

```bash
cd phibrain-site
npm install
npm run dev
# http://localhost:3000
```

Builder pour la production :

```bash
npm run build
npm run start
```

## 2. Modifier le contenu

Tout le contenu éditorial est centralisé dans **`lib/data.ts`**. Aucune base de données, aucun CMS — on édite, on rebuild.

### 2.1 Informations entreprise (`SITE`)
```ts
export const SITE = {
  name: "PhiBrain Inc",
  shortName: "PhiBrain",
  url: "https://phibraininc.github.io/site/",
  description: "...",
  tagline: "Là où la créativité rencontre l'intelligence.",
  email: "phibraininc@gmail.com",
  phones: ["+237 696 41 57 59", "+237 657 23 55 96"],
  location: "Douala · Yaoundé · Cameroun",
};
```

### 2.2 Liens de navigation (`NAV_LINKS`)
Tableau de `{ label, href }`. Les `href` doivent pointer sur des ancres existantes (`#hero`, `#services`, …).

### 2.3 Services (`SERVICES`)
3 entrées par défaut. Chaque service a : `id`, `icon` (`"branding" | "web" | "mobile"`), `title`, `description`, `features: string[]`.

> Pour ajouter une icône, étendre `IconName` dans `components/ui/icon.tsx` et `SERVICE_ICONS` dans `services-section.tsx`.

### 2.4 Compétences (`SKILLS`)
`{ name, level (0–100), category }`. Catégories : `Front-end`, `Back-end`, `Mobile`, `Design`.

### 2.5 Statistiques (`STATS`)
`{ label, value, suffix? }`. Le suffixe par défaut est `+`.

### 2.6 Portfolio (`PORTFOLIO`)
`{ id, title, category, description, tags, link?, repo? }`. Catégories : `Apps`, `Design`, `Sites`.
Si on ajoute une nouvelle catégorie, mettre à jour `PORTFOLIO_FILTERS` et le type `PortfolioCategory`.

### 2.7 Équipe (`TEAM`)
`{ name, role, bio, linkedin? }`. L'avatar est généré depuis les initiales — pas besoin d'image.

### 2.8 Témoignages (`TESTIMONIALS`)
`{ name, role, quote }`. Le carousel autoplay toutes les 7 s (modifiable dans `testimonials-section.tsx`).

## 3. Modifier les couleurs

Toute la palette vit dans **`app/globals.css`** via le bloc `@theme` (Tailwind v4) et les variables CSS `:root` / `.dark`.

### 3.1 Couleurs de marque
```css
@theme {
  --color-phi-cyan: #00d4ff;   /* accent principal */
  --color-phi-blue: #0066cc;   /* accent secondaire */
}
```
Le gradient `linear-gradient(135deg, #0066cc, #00d4ff)` est exposé via `.bg-phi-gradient` et `.text-phi-gradient`.

### 3.2 Couleurs runtime (dark / light)
```css
:root {                /* mode clair */
  --background: #f8f9fa;
  --foreground: #111111;
  --surface: #ffffff;
  --surface-muted: #eef1f5;
  --border: rgba(17, 17, 17, 0.08);
  --hero-overlay: rgba(248, 249, 250, 0.55);
}
.dark {                /* mode sombre */
  --background: #0a0a0a;
  --foreground: #ffffff;
  --surface: #111114;
  --surface-muted: #16161a;
  --border: rgba(255, 255, 255, 0.08);
  --hero-overlay: rgba(10, 10, 10, 0.62);
}
```
Modifier ces valeurs change instantanément le site dans les 2 modes.

## 4. Modifier l'animation 3D

Tous les fichiers Three sont dans `components/three/`.

### 4.1 Couleurs des hémisphères
- `CircuitHemisphere.tsx` : constantes `CYAN`, `BLUE` (haut de fichier).
- `NeuronHemisphere.tsx` : constantes `CYAN`, `CYAN_SOFT`.

### 4.2 Nombre de nœuds / traces
- `CircuitHemisphere count={14}` (passé depuis `BrainScene.tsx`).
- `NeuronHemisphere count={36}` (passé depuis `BrainScene.tsx`).
Réduire ces valeurs allège fortement le GPU (utile pour mobile bas de gamme).

### 4.3 Vitesse de rotation
Dans `BrainScene.tsx` :
```ts
g.rotation.y += delta * 0.12; // 0.12 rad/s — augmenter = plus rapide
```

### 4.4 Amplitude souris
```ts
const maxX = THREE.MathUtils.degToRad(15); // ±15°
const maxY = THREE.MathUtils.degToRad(15);
```

### 4.5 Qualité de rendu
Dans `BrainCanvas.tsx` :
```ts
dpr={[1, coarse ? 1.5 : 2]} // mobile plafonné à 1.5
```
Pour désactiver l'anti-aliasing sur tous les appareils : `gl={{ antialias: false }}`.

### 4.6 Désactiver complètement les animations
Le code respecte automatiquement `prefers-reduced-motion`. Pour forcer côté CSS, ajouter dans `globals.css` :
```css
@media (prefers-reduced-motion: no-preference) { /* anim ON */ }
```

## 5. SEO

- Modifier `metadata` dans `app/layout.tsx` (title, description, OG, keywords).
- Mettre à jour `SITE.url` dans `lib/data.ts` (utilisé par sitemap et OG).
- Le sitemap et robots sont auto-générés (`app/sitemap.ts`, `app/robots.ts`).

## 6. Logos

Trois fichiers dans `public/` :
- `phibrain-logo.png` — utilisé en **dark mode** (logo sur fond sombre).
- `phibrain-logo-light-transparent.png` — utilisé en **light mode** (transparent).
- `phibrain-logo-light.png` — backup, **ne pas référencer** dans le code.

Pour remplacer : écraser le fichier au même nom dans `public/`. Le composant `<Logo />` switche automatiquement.

Hauteurs par défaut : Navbar = 40 px, Footer = 32 px.

## 7. Polices

Configurées via `next/font/google` dans `app/layout.tsx` :
- `Space_Grotesk` → variable `--font-space-grotesk` → exposée comme `font-display` dans Tailwind.
- `Inter` → variable `--font-inter` → exposée comme `font-sans`.

Pour changer une police : remplacer l'import et la variable CSS dans `globals.css`.

## 8. Déploiement Vercel

### 8.1 Première mise en ligne
1. Pousser le repo sur GitHub.
2. Sur [vercel.com/new](https://vercel.com/new) → **Import Git Repository**.
3. Sélectionner le repo `phibrain-site`. Vercel détecte automatiquement Next.js.
4. **Build command** : `next build` (par défaut). **Output directory** : laisser par défaut.
5. Cliquer **Deploy**. Le site est en ligne sur `*.vercel.app` en ~2 min.
6. **Settings → Domains** → ajouter `phibraininc.com` (ou autre) et configurer les DNS.

### 8.2 Variables d'environnement
Aucune nécessaire pour ce site statique.

### 8.3 Déploiements suivants
Chaque `git push` sur la branche `main` redéploie automatiquement. Les Pull Requests ont des previews dédiées.

## 9. Performance — checklist

- [x] Composants 3D en **lazy** (`dynamic` + `ssr: false`)
- [x] DPR plafonné à 1.5 sur mobile
- [x] Images en `next/image` (auto-WebP/AVIF + sizes)
- [x] Polices via `next/font` (zéro CLS)
- [x] `prefers-reduced-motion` respecté
- [x] BufferGeometry pour les lignes 3D (pas de mesh par segment)
- [x] CSS-first dark mode (zéro flash, sans JS bloquant)

## 10. Accessibilité — checklist

- [x] `aria-label` sur tous les boutons icônes
- [x] `role="switch"` + `aria-checked` sur le toggle thème
- [x] Focus visibles (`:focus-visible` → outline cyan)
- [x] Contraste WCAG AA (texte foncé sur clair, clair sur foncé)
- [x] `aria-live="polite"` sur le status du formulaire de contact
- [x] Navigation clavier complète

## 11. Mise à jour des dépendances

```bash
npm outdated                  # voir les versions
npm update                    # mineures + patch
npx next upgrade              # upgrade Next.js (codemod auto)
```

> Tester un build complet (`npm run build`) après chaque upgrade majeur.
