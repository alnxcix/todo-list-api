// ** Libraries **
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

// ** Data & Models **
import { taskMap, taskOrder } from "../data/tasks";
import { Task } from "../models/Task";

// ** Utilities & Constants **
import { mergeSort } from "../utils/mergeSort";
import { AppError } from "../utils/AppError";
import { VALID_SORT_KEYS } from "../constants/taskConstants";

/**
 * @desc Get all tasks (with optional filtering & sorting)
 * @route GET /tasks
 */
export const getAllTasks = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!taskOrder) return next(new AppError("No tasks found", 404));

  const { isCompleted, sortBy, order = "asc" } = req.query;

  // ** Convert `isCompleted` query parameter to boolean (if provided) **
  const filterCompleted =
    isCompleted !== undefined ? isCompleted === "true" : null;

  // ** Tasks' default order **
  let orderedTasks: Task[] = taskOrder.map((id, index) => ({
    ...taskMap.get(id)!,
    position: index,
  }));

  // ** Filter by `isCompleted` if true **
  if (filterCompleted !== null) {
    orderedTasks = orderedTasks.filter(
      (task) => task.isCompleted === filterCompleted
    );
  }

  // ** Apply sorting if sortBy is provided **
  if (sortBy) {
    // ** Error handling: Validate `sortBy`
    if (!VALID_SORT_KEYS.includes(sortBy as keyof Task)) {
      return next(new AppError("Invalid sortBy parameter", 400));
    }

    // ** Error handling: Validate `order`
    if (order !== "asc" && order !== "desc") {
      return next(new AppError("Invalid order parameter", 400));
    }

    // ** Apply merge sort **
    orderedTasks = mergeSort(
      orderedTasks,
      sortBy as keyof Task,
      order as "asc" | "desc"
    );
  }

  res.status(200).json({ tasks: orderedTasks });
};

/**
 * @desc Add a new task
 * @route POST /tasks
 */
export const addTask = (req: Request, res: Response, next: NextFunction) => {
  const { title, description } = req.body;

  // ** Error handling: Validate that a title is provided **
  if (!title) return next(new AppError("Title is required", 400));

  // ** New task **
  const newTask: Task = {
    id: uuidv4(), // Generate a unique ID
    title,
    description: description || "",
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // ** Save the task in memory **
  taskMap.set(newTask.id, newTask);
  taskOrder.push(newTask.id); // Maintain order

  res.status(201).json({
    message: "Task successfully added",
    newTask: { ...newTask, position: taskOrder.length - 1 },
  });
};

/**
 * @desc Update a task by ID
 * @route PUT /tasks/:id
 */
export const updateTask = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { title, description, isCompleted } = req.body;

  // ** Error handling: Check if task exists **
  if (!taskMap.has(id)) return next(new AppError("Task not found", 404));

  const task = { ...taskMap.get(id)!, position: taskOrder.indexOf(id) };

  // ** Update fields **
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (isCompleted !== undefined) task.isCompleted = isCompleted;

  task.updatedAt = new Date();

  // ** Save updated task in memory **
  taskMap.set(id, task);

  res.status(200).json({
    message: "Task successfully updated",
    updatedTask: task,
  });
};

/**
 * @desc Delete a task by ID
 * @route DELETE /tasks/:id
 */
export const deleteTask = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  // ** Error handling: Check if task exists **
  if (!taskMap.has(id)) return next(new AppError("Task not found", 404));

  const deletedTask = { ...taskMap.get(id), position: taskOrder.indexOf(id) };

  // ** Remove task from memory **
  taskMap.delete(id);
  taskOrder.splice(taskOrder.indexOf(id), 1); // Maintain order

  res.status(200).json({
    message: "Task successfully deleted",
    deletedTask,
  });
};

/**
 * @desc Reorder tasks
 * @route POST /tasks/reorder
 */
export const reorderTasks = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { taskId, newPosition } = req.body;

  const currentIndex = taskOrder.indexOf(taskId);

  // ** Error handling: Validate that the task exists and is in the order list **
  if (!taskMap.has(taskId) || currentIndex === -1)
    return next(new AppError("Task not found", 404));

  // ** Error handling: Validate new position **
  if (newPosition < 0 || newPosition >= taskOrder.length)
    return next(new AppError("Invalid new position", 400));

  // ** Move task to new position **
  taskOrder.splice(newPosition, 0, taskOrder.splice(currentIndex, 1)[0]);

  taskMap.get(taskId)!.updatedAt = new Date();

  res.status(200).json({
    message: "Task reordered successfully",
    taskOrder,
  });
};
