import { Home } from "./Home";

export interface WorkExperience {
  id: string;
  title: string;
  dateRange: string;
  description: string;
  homeId: string;
  home: Home;
  createdAt: Date;
  updatedAt: Date;

  [key: string]: any;
}
