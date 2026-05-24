import { Schema, model, models, type InferSchemaType } from "mongoose";

const TestimonialSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 80, trim: true },
    role: { type: String, required: true, maxlength: 120, trim: true },
    quote: { type: String, required: true, maxlength: 800, trim: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

export type TestimonialDoc = InferSchemaType<typeof TestimonialSchema> & { _id: string };
export const Testimonial = models.Testimonial || model("Testimonial", TestimonialSchema);
