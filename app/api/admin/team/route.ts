import { TeamMember } from "@/lib/models/TeamMember";
import { TeamMemberSchema } from "@/lib/validation";
import { createCollectionHandlers } from "@/lib/admin/crud";

export const { GET, POST } = createCollectionHandlers("team", TeamMember, TeamMemberSchema);
