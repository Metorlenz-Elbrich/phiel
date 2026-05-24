import { Schema, model, models, type InferSchemaType } from "mongoose";

const ServiceSchema = new Schema(
  {
    icon:           { type: String, required: true },
    title_fr:       { type: String, required: true, maxlength: 100, trim: true },
    title_en:       { type: String, default: "",    maxlength: 100, trim: true },
    description_fr: { type: String, required: true, maxlength: 500, trim: true },
    description_en: { type: String, default: "",    maxlength: 500, trim: true },
    features_fr:    { type: [String], default: [], validate: (v: string[]) => v.length <= 10 },
    features_en:    { type: [String], default: [] },
    order:          { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

export type ServiceDoc = InferSchemaType<typeof ServiceSchema> & { _id: string };
export const Service = models.Service || model("Service", ServiceSchema);
