import { Stat } from "@/lib/models/Stat";
import { StatSchema } from "@/lib/validation";
import { createItemHandlers } from "@/lib/admin/crud";

export const { PUT, DELETE } = createItemHandlers("stats", Stat, StatSchema);
