import { Schema, model, models, type InferSchemaType } from "mongoose";

const SlideSchema = new Schema(
  {
    phrase_fr: { type: String, required: true, maxlength: 300, trim: true },
    phrase_en: { type: String, required: true, maxlength: 300, trim: true },
    imageUrl:  { type: String, required: true, maxlength: 2048, trim: true },
    order:     { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

export type SlideDoc = InferSchemaType<typeof SlideSchema> & { _id: string };
export const Slide = models.Slide || model("Slide", SlideSchema);
