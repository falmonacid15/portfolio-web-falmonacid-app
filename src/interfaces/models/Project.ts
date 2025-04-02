import { Home } from "./Home";
import { Portfolio } from "./Portfolio";

export interface Project {
  id: string;
  name: string;
  shortDescription?: string;
  longDescription?: string;
  images: string[];
  repositoryUrl?: string;
  demoUrl?: string;
  techonologies: string[];
  languages: string[];
  hasDemo: boolean;
  hasRepo: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  portfolioId: string;
  portfolio: Portfolio;
  homeId?: string;
  home?: Home;
}
