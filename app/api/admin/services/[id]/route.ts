import { Service } from "@/lib/models/Service";
import { ServiceSchema } from "@/lib/validation";
import { createItemHandlers } from "@/lib/admin/crud";

export const { PUT, DELETE } = createItemHandlers("services", Service, ServiceSchema);
