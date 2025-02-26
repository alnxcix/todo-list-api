import { Task } from "../models/Task";

// ** Map can store tasks with fast lookup **
export const taskMap = new Map<string, Task>();

// ** Array can store task IDs in order **
export const taskOrder: string[] = [];
