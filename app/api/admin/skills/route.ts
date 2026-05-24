import { Skill } from "@/lib/models/Skill";
import { SkillSchema } from "@/lib/validation";
import { createCollectionHandlers } from "@/lib/admin/crud";

export const { GET, POST } = createCollectionHandlers("skills", Skill, SkillSchema);
