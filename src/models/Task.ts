export interface Task {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  position: number; // for reordering
  createdAt: Date;
  updatedAt: Date;
}
