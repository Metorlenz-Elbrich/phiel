import { Schema, model, models, type InferSchemaType } from "mongoose";

const ServiceSchema = new Schema(
  {
    icon: { type: String, enum: ["branding", "web", "mobile"], required: true },
    title: { type: String, required: true, maxlength: 100, trim: true },
    description: { type: String, required: true, maxlength: 500, trim: true },
    features: { type: [String], default: [], validate: (v: string[]) => v.length <= 10 },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

export type ServiceDoc = InferSchemaType<typeof ServiceSchema> & { _id: string };
export const Service = models.Service || model("Service", ServiceSchema);
