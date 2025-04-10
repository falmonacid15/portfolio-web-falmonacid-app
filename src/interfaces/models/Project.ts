import { Home } from "./Home";
import { Portfolio } from "./Portfolio";
import { BaseRow } from "../../components/ui/DataTable";

export interface Project extends BaseRow {
  id: string;
  name: string;
  shortDescription?: string;
  longDescription?: string;
  mainImage: string;
  images: string[];
  repositoryUrl?: string;
  demoUrl?: string;
  techonologies: string[];
  languages: string[];
  hasDemo: boolean;
  hasRepo: boolean;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  portfolioId: string;
  portfolio: Portfolio;
  homeId?: string;
  home?: Home;
  [key: string]: any;
}
