import { Project } from "./Project";

export interface Portfolio {
  id: string;
  title: string;
  description: string;
  projects: Project[];
  createdAt: Date;
  updatedAt: Date;
}
