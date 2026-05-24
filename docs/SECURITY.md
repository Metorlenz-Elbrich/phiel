# Sécurité — PhiBrain site

État : dashboard admin actif (`/admin`) avec MongoDB + NextAuth v5.
Les 10 mesures OWASP demandées sont **appliquées dans le code**.

---

## Checklist OWASP Top 10

| #   | Catégorie                  | Statut       | Où                                                              |
| --- | -------------------------- | ------------ | --------------------------------------------------------------- |
| A01 | Broken Access Control      | ✅ appliqué  | `proxy.ts` + `auth()` revalidé dans `lib/admin/crud.ts`         |
| A02 | Cryptographic Failures     | ✅ appliqué  | `.env*` ignoré, secrets jamais loggés, cookies `httpOnly+secure`|
| A03 | Injection / XSS            | ✅ appliqué  | Zod (`lib/validation.ts`) + `mongoose.set("sanitizeFilter")`    |
| A04 | Insecure Design            | ✅ appliqué  | `RateLimiterMemory` 5/IP/15min dans `lib/auth.ts`               |
| A05 | Security Misconfiguration  | ✅ appliqué  | Headers admin dans `next.config.ts` + `apiError()` générique    |
| A06 | Vulnerable Components      | 🔄 continu   | `npm audit` à chaque release                                    |
| A07 | Auth Failures              | ✅ appliqué  | bcrypt salt 12, JWT 8h, sameSite=strict, message neutre         |
| A08 | Software/Data Integrity    | 🔄 continu   | `package-lock.json` versionné                                   |
| A09 | Logging Failures           | ✅ appliqué  | `lib/security-log.ts` — login + access + admin actions          |
| A10 | SSRF                       | N/A          | Aucun fetch serveur vers URL fournie par user                   |

---

## Générer `NEXTAUTH_SECRET` (≥ 32 caractères)

```sh
openssl rand -base64 32
```

PowerShell équivalent :
```powershell
[Convert]::ToBase64String((1..32 | % {Get-Random -Max 256}))
```

---

## MongoDB Atlas — instructions

1. Cluster gratuit (M0) sur https://www.mongodb.com/atlas
2. **Database Access** → créer un utilisateur dédié `phibrain-app` avec
   le rôle **readWrite sur la base `phibrain` uniquement** (pas
   `dbAdmin`, pas `userAdmin`, pas de cluster admin).
3. **Network Access** → whitelist les IPs sortantes Vercel
   (https://vercel.com/guides/how-to-allowlist-deployment-ip-address)
   ou `0.0.0.0/0` en dev avec mot de passe long en compensation.
4. **Connect → Drivers** → coller la connection string dans
   `MONGODB_URI` de `.env.local`. Format :
   ```
   mongodb+srv://phibrain-app:<password>@cluster.mongodb.net/phibrain
   ```
5. TLS activé par défaut sur Atlas — ne pas désactiver.

---

## Déploiement Vercel — recommandations

1. Variables d'environnement dans **Vercel Dashboard → Settings → Env
   Variables**. Marquer `NEXTAUTH_SECRET` et `MONGODB_URI` comme
   **Sensitive**.
2. `NEXTAUTH_URL` doit refléter l'URL de prod.
3. Branche `main` protégée : reviews + status checks avant merge.
4. Activer **Vercel Authentication** sur les Preview Deployments.
5. **Audit CI** : ajouter `npm audit --audit-level=high` au pipeline.
6. **Monitoring** : brancher Sentry/Datadog/Logtail dans
   `lib/security-log.ts` → `emit()` et `lib/api-error.ts` → `console.error`.
7. Si déploiement multi-instances, remplacer `RateLimiterMemory` par
   `RateLimiterRedis` dans `lib/auth.ts` (sinon chaque lambda a son
   propre compteur).

---

## Notes détaillées

- **`mongoose-sanitize`** (installé) est un complément ; la vraie
  protection est `mongoose.set("sanitizeFilter", true)` activé dans
  `lib/mongodb.ts`.
- **Champs riches** (markdown/HTML) → ajouter `isomorphic-dompurify`
  côté serveur avant stockage. Aucun champ riche dans le schéma actuel.
- **`dangerouslySetInnerHTML`** : interdit sur tout contenu venant de
  la DB. Le rendu React échappe par défaut le HTML.
