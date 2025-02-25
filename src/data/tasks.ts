import { Task } from "../models/Task";

export const tasks: Task[] = [
  {
    id: "1",
    title: "First Task",
    description: "This is your first task",
    isCompleted: false,
    position: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Second Task",
    description: "This is your second task",
    isCompleted: false,
    position: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
