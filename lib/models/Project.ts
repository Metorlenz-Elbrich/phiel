import { Schema, model, models, type InferSchemaType } from "mongoose";

const ProjectSchema = new Schema(
  {
    title_fr:       { type: String, required: true, maxlength: 100, trim: true },
    title_en:       { type: String, default: "",    maxlength: 100, trim: true },
    category:       { type: String, required: true, index: true },
    description_fr: { type: String, required: true, maxlength: 500, trim: true },
    description_en: { type: String, default: "",    maxlength: 500, trim: true },
    tags:     { type: [String], default: [], validate: (v: string[]) => v.length <= 8 },
    link:     { type: String, maxlength: 2048, trim: true },
    repo:     { type: String, maxlength: 2048, trim: true },
    imageUrl: { type: String, default: "", maxlength: 2048, trim: true },
    gradient: {
      type: [String],
      default: ["#0066cc", "#00d4ff"],
      validate: (v: string[]) =>
        v.length === 2 && v.every((c) => /^#[0-9a-fA-F]{6}$/.test(c)),
    },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

export type ProjectDoc = InferSchemaType<typeof ProjectSchema> & { _id: string };
export const Project = models.Project || model("Project", ProjectSchema);
