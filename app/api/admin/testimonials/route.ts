import { Testimonial } from "@/lib/models/Testimonial";
import { TestimonialSchema } from "@/lib/validation";
import { createCollectionHandlers } from "@/lib/admin/crud";

export const { GET, POST } = createCollectionHandlers(
  "testimonials",
  Testimonial,
  TestimonialSchema
);
