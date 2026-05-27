import { Slide } from "@/lib/models/Slide";
import { SlideSchema } from "@/lib/validation";
import { createItemHandlers } from "@/lib/admin/crud";

export const { PUT, DELETE } = createItemHandlers("slides", Slide, SlideSchema);
