import { Project } from "./Project";
import { WorkExperience } from "./WorkExperience";

export interface Home {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  descriptions: string[];
  workExperienceTitle: string;
  workExperienceSubtitle: string;
  workExperiences: WorkExperience[];
  portfolioTitle: string;
  portfolioSubtitle: string;
  projects: Project[];
  createdAt: Date;
  updatedAt: Date;
}
