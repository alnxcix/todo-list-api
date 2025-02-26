import { Task } from "../models/Task";

/**
 * Allowed sorting keys for tasks.
 */
export const VALID_SORT_KEYS: (keyof Task)[] = [
  "title",
  "isCompleted",
  "createdAt",
  "updatedAt",
];
