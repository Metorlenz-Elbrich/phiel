import { Schema, model, models, type InferSchemaType } from "mongoose";

const TestimonialSchema = new Schema(
  {
    name_fr:  { type: String, required: true, maxlength: 80,  trim: true },
    name_en:  { type: String, default: "",    maxlength: 80,  trim: true },
    role_fr:  { type: String, required: true, maxlength: 120, trim: true },
    role_en:  { type: String, default: "",    maxlength: 120, trim: true },
    quote_fr: { type: String, required: true, maxlength: 800, trim: true },
    quote_en: { type: String, default: "",    maxlength: 800, trim: true },
    order:    { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

export type TestimonialDoc = InferSchemaType<typeof TestimonialSchema> & { _id: string };
export const Testimonial = models.Testimonial || model("Testimonial", TestimonialSchema);
