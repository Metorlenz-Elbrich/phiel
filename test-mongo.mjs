// test-mongo.mjs — corrigé avec les credentials
import mongoose from "mongoose";

const uri = "mongodb+srv://phibrainincadmin:Letsbrain237@cluster0.0mjilgx.mongodb.net/?appName=Cluster0";

try {
  await mongoose.connect(uri);
  console.log("✅ Connexion MongoDB réussie !");
  await mongoose.disconnect();
} catch (err) {
  console.error("❌ Erreur :", err.message);
}