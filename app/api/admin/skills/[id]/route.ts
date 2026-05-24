import { Skill } from "@/lib/models/Skill";
import { SkillSchema } from "@/lib/validation";
import { createItemHandlers } from "@/lib/admin/crud";

export const { PUT, DELETE } = createItemHandlers("skills", Skill, SkillSchema);
