import { Project } from "@/lib/models/Project";
import { ProjectSchema } from "@/lib/validation";
import { createCollectionHandlers } from "@/lib/admin/crud";

export const { GET, POST } = createCollectionHandlers("projects", Project, ProjectSchema);
