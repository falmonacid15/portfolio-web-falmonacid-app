import { AboutMe } from "./Aboutme";
import { Skill } from "./Skill";

export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  skills: Skill[];
  aboutMeId: string;
  aboutMe: AboutMe;
  createdAt: Date;
  updatedAt: Date;
}
