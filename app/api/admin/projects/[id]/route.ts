import { Project } from "@/lib/models/Project";
import { ProjectSchema } from "@/lib/validation";
import { createItemHandlers } from "@/lib/admin/crud";

export const { PUT, DELETE } = createItemHandlers("projects", Project, ProjectSchema);
