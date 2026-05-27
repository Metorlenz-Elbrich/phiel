import { Slide } from "@/lib/models/Slide";
import { SlideSchema } from "@/lib/validation";
import { createCollectionHandlers } from "@/lib/admin/crud";

export const { GET, POST } = createCollectionHandlers("slides", Slide, SlideSchema);
