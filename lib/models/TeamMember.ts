import { Schema, model, models, type InferSchemaType } from "mongoose";

const TeamMemberSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 80, trim: true },
    role: { type: String, required: true, maxlength: 120, trim: true },
    bio: { type: String, required: true, maxlength: 600, trim: true },
    linkedin: { type: String, maxlength: 2048, trim: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

export type TeamMemberDoc = InferSchemaType<typeof TeamMemberSchema> & { _id: string };
export const TeamMember = models.TeamMember || model("TeamMember", TeamMemberSchema);
