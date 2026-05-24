import { Service } from "@/lib/models/Service";
import { ServiceSchema } from "@/lib/validation";
import { createCollectionHandlers } from "@/lib/admin/crud";

export const { GET, POST } = createCollectionHandlers("services", Service, ServiceSchema);
