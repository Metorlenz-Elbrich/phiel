import { Stat } from "@/lib/models/Stat";
import { StatSchema } from "@/lib/validation";
import { createCollectionHandlers } from "@/lib/admin/crud";

export const { GET, POST } = createCollectionHandlers("stats", Stat, StatSchema);
