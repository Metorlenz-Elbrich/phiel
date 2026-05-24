import { TeamMember } from "@/lib/models/TeamMember";
import { TeamMemberSchema } from "@/lib/validation";
import { createItemHandlers } from "@/lib/admin/crud";

export const { PUT, DELETE } = createItemHandlers("team", TeamMember, TeamMemberSchema);
