import { Schema, model, models, type InferSchemaType } from "mongoose";

const TeamMemberSchema = new Schema(
  {
    name_fr:  { type: String, required: true, maxlength: 80,  trim: true },
    name_en:  { type: String, default: "",    maxlength: 80,  trim: true },
    role_fr:  { type: String, required: true, maxlength: 120, trim: true },
    role_en:  { type: String, default: "",    maxlength: 120, trim: true },
    bio_fr:   { type: String, required: true, maxlength: 600, trim: true },
    bio_en:   { type: String, default: "",    maxlength: 600, trim: true },
    linkedin: { type: String, maxlength: 2048, trim: true },
    order:    { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

export type TeamMemberDoc = InferSchemaType<typeof TeamMemberSchema> & { _id: string };
export const TeamMember = models.TeamMember || model("TeamMember", TeamMemberSchema);
