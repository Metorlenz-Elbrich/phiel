import { Schema, model, models, type InferSchemaType } from "mongoose";

const SkillSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 80, trim: true },
    level: { type: Number, required: true, min: 0, max: 100 },
    category: {
      type: String,
      enum: ["Front-end", "Back-end", "Mobile", "Design"],
      required: true,
      index: true,
    },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

export type SkillDoc = InferSchemaType<typeof SkillSchema> & { _id: string };
export const Skill = models.Skill || model("Skill", SkillSchema);
