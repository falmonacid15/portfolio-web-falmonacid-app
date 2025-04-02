import { SkillCategory } from "./SkillCategory";

export interface AboutMe {
  id: string;
  title: string;
  descriptions: string[];
  skillsTitle: string;
  skillsSubtitle: string;
  skillCategories: SkillCategory[];
  createdAt: Date;
  updatedAt: Date;
}
