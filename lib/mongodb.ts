import mongoose from "mongoose";

// OWASP A03 — bloque les injections par opérateurs ($gt, $ne, etc.)
// dans les filtres construits depuis des objets utilisateur.
mongoose.set("sanitizeFilter", true);
// OWASP — empêche strict mode de laisser passer des champs inconnus.
mongoose.set("strictQuery", true);

const MONGODB_URI = process.env.MONGODB_URI;

// Cache global pour éviter de reconnecter à chaque hot reload en dev.
type Cached = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var __mongooseCache: Cached | undefined;
}

const cached: Cached =
  global.__mongooseCache ?? (global.__mongooseCache = { conn: null, promise: null });

/**
 * Renvoie une connexion Mongoose partagée. Lance si MONGODB_URI est absent
 * — pas de fallback silencieux.
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI manquant — vérifier .env.local");
  }
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      // OWASP A02 — ne jamais logger l'URI.
      autoIndex: process.env.NODE_ENV !== "production",
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

/**
 * Variante "soft" : renvoie null au lieu de jeter si la DB est indispo.
 * Utilisée par les sections publiques pour fallback gracieux sur data.ts.
 */
export async function tryConnectDB(): Promise<typeof mongoose | null> {
  try {
    return await connectDB();
  } catch (err) {
    console.warn("[mongodb] connexion indisponible — fallback sur data statique");
    void err;
    return null;
  }
}
