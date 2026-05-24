import { Testimonial } from "@/lib/models/Testimonial";
import { TestimonialSchema } from "@/lib/validation";
import { createItemHandlers } from "@/lib/admin/crud";

export const { PUT, DELETE } = createItemHandlers(
  "testimonials",
  Testimonial,
  TestimonialSchema
);
