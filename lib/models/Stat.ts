import { Schema, model, models, type InferSchemaType } from "mongoose";

const StatSchema = new Schema(
  {
    label: { type: String, required: true, maxlength: 80, trim: true },
    value: { type: Number, required: true, min: 0 },
    suffix: { type: String, default: "", maxlength: 8, trim: true },
    icon: { type: String, default: "sparkle", maxlength: 32, trim: true },
    color: { type: String, default: "#00d4ff", match: /^#[0-9a-fA-F]{6}$/ },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

export type StatDoc = InferSchemaType<typeof StatSchema> & { _id: string };
export const Stat = models.Stat || model("Stat", StatSchema);
