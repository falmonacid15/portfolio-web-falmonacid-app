import { SkillCategory } from "./SkillCategory";

export interface Skill {
  id: string;
  name: string;
  icon: string;
  categoryId: string;
  category: SkillCategory;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any;
}
