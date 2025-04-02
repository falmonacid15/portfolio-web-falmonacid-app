export interface User {
  id: string;
  email: string;
  name?: string;
  password?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
